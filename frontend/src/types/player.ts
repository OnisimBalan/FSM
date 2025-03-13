export default class Player {
    id: string;
    name: string;
    position: { x: number; y: number };
  
    constructor(name: string, id: string) {
        this.id = id;
      this.name = name;
      this.position = { x: 0, y: 0 };
    }
  
    updatePosition(x: number, y: number) {
      this.position = { x, y };
    }
  }
  