export function downloadJsonData(data: unknown, filename: string) {
    // Create a blob with the JSON data
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a link element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename; // Set the download filename
    
    // Append the link to the body and trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up: remove the link and revoke the URL object
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
  