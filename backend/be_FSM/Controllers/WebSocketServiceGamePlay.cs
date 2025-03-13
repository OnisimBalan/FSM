namespace be_FSM
{
    using Microsoft.AspNetCore.Http;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Logging;
    using System.IO;
    using System.Text;
    using System.Text.Json;
    using System.Net.WebSockets;
    using System.Threading;
    using System.Threading.Tasks;

    public class WebSocketServiceGamePlay : BackgroundService
    {
        private readonly ILogger<WebSocketServiceGamePlay> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        // Constructor that initializes the logger and HTTP context accessor
        public WebSocketServiceGamePlay(ILogger<WebSocketServiceGamePlay> logger, IHttpContextAccessor httpContextAccessor)
        {
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        // Executes the background service continuously until the token is cancelled
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                await Task.Delay(1000, stoppingToken); // Wait before checking for WebSocket connections
                await HandleWebSocketCommunication(stoppingToken);
            }
        }

        // Handles WebSocket communication if there's an active WebSocket request
        private async Task HandleWebSocketCommunication(CancellationToken stoppingToken)
        {
            // Checking the URL path for WebSocket connection at the specific URL
            if (_httpContextAccessor.HttpContext?.WebSockets.IsWebSocketRequest ?? false)
            {
                // Check if the request URL matches "ws://localhost:5000/playerdata/ws"
                var requestPath = _httpContextAccessor.HttpContext.Request.Path.ToString();
                if (requestPath == "ws://localhost:5000//playerdata/ws")
                {
                    try
                    {
                        var socket = await _httpContextAccessor.HttpContext.WebSockets.AcceptWebSocketAsync();
                        _logger.LogInformation("WebSocket connection established on ws://localhost:5000/playerdata/ws.");
                        await ProcessWebSocketData(socket, stoppingToken);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"Error accepting WebSocket connection: {ex.Message}");
                    }
                }
                else
                {
                    _logger.LogWarning("WebSocket request received at an invalid path. Expected: /playerdata/ws");
                }
            }
        }

        // Processes the WebSocket data once the connection is established
        private async Task ProcessWebSocketData(WebSocket socket, CancellationToken stoppingToken)
        {
            var buffer = new byte[1024 * 4];
            WebSocketReceiveResult result;

            // Keep receiving messages until the WebSocket is closed or cancellation requested
            while (socket.State == WebSocketState.Open && !stoppingToken.IsCancellationRequested)
            {
                try
                {
                    result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), stoppingToken);

                    if (result.MessageType == WebSocketMessageType.Close)
                    {
                        _logger.LogInformation("WebSocket connection closed by the client.");
                        break;
                    }

                    var message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                    _logger.LogInformation($"Received message: {message}");

                    // Deserialize the received message to extract player data
                    var playerData = JsonSerializer.Deserialize<PlayerData>(message);

                    if (playerData != null)
                    {
                        // Store the received player data into a CSV file
                        await StorePlayerDataInCsvAsync(playerData);
                    }
                    else
                    {
                        _logger.LogWarning("Received invalid player data.");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error processing WebSocket data: {ex.Message}");
                    break;
                }
            }

            // Close the WebSocket connection properly
            await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", stoppingToken);
            _logger.LogInformation("WebSocket connection closed.");
        }

        // Stores the received player data into a CSV file
        private async Task StorePlayerDataInCsvAsync(PlayerData playerData)
        {
            var csvFilePath = "player_data.csv";

            try
            {
                bool fileExists = File.Exists(csvFilePath);
                var fileLock = new object();

                // Open the CSV file in append mode and write data
                await Task.Run(() =>
                {
                    lock (fileLock)
                    {
                        using (var writer = new StreamWriter(csvFilePath, append: true))
                        {
                            // If the file doesn't exist, create it and add headers
                            if (!fileExists)
                            {
                                writer.WriteLine("Name,Position X,Position Y");
                            }

                            // Write the player data to the CSV file
                            writer.WriteLine($"{playerData.Name},{playerData.Position.X},{playerData.Position.Y}");
                        }
                    }
                });

                _logger.LogInformation($"Stored player data for {playerData.Name} at position ({playerData.Position.X}, {playerData.Position.Y})");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error writing player data to CSV: {ex.Message}");
            }
        }
    }
}
