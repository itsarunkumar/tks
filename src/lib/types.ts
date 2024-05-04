export interface Item {
    id: string;
    name: string;
    content: string;
    containerId: string;
  }
  
  export interface Container {
    id: string;
    name: string;
    items: Item[];
  }