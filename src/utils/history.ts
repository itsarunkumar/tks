// Function to implement the history , it logs the data about activities in the localstorage
export const logHistory = (data: unknown) => {
    const history = localStorage.getItem('history');
    let historyData = [];
    if (history) {
        historyData = JSON.parse(history);
    }
    historyData.push(data);
    localStorage.setItem('history', JSON.stringify(historyData));
}

