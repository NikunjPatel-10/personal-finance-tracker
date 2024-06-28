export function formatDate(inputDate: string): string {
    const date = new Date(inputDate);
    const formattedDate = date.toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });

    return formattedDate.replace(',', ''); // Removing the comma after the year
}