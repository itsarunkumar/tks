interface Container {
    id: string;
    name: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: any[];
  }

// Function to save containers to localStorage
export const saveContainersToLocalStorage = (containers: Container[]) => {

    const oldContainers = loadContainersFromLocalStorage();

    if (oldContainers) {
      containers = containers.filter((container) => oldContainers.some((oldContainer: { id: string; }) => oldContainer.id !== container.id));
      containers = containers.concat(oldContainers);
      
    }

    localStorage.setItem('dndContainers', JSON.stringify(containers));
  };
  
  // Function to load containers from localStorage
  export const loadContainersFromLocalStorage = () => {
    const storedContainers = localStorage.getItem('dndContainers');
    return storedContainers ? JSON.parse(storedContainers) : [];
  };
  
  // Function to add a new container to localStorage
  export const addContainerToLocalStorage = (newContainer: Container) => {
    const containers = loadContainersFromLocalStorage();
    containers.push(newContainer);
    saveContainersToLocalStorage(containers);
  };
  
  // Function to update an existing container in localStorage
  export const updateContainerInLocalStorage = (updatedContainer: Container) => {
    const containers = loadContainersFromLocalStorage();
    const index = containers.findIndex((c: { id: string; }) => c.id === updatedContainer.id);
    if (index !== -1) {
      containers[index] = updatedContainer;
      saveContainersToLocalStorage(containers);
    }
  };
  
  // Function to delete a container from localStorage
  export const deleteContainerFromLocalStorage = (containerId: string) => {
    const containers = loadContainersFromLocalStorage().filter((c: { id: string; }) => c.id !== containerId);
    saveContainersToLocalStorage(containers);
  };
  