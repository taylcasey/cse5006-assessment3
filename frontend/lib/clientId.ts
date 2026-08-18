// placeholder logic for login system that generates clientid for requestlog functionality
export function getClientId(): string {
    if (typeof window === "undefined") return "server";

    let clientId = localStorage.getItem("clientId");
    if (!clientId) {
        clientId = crypto.randomUUID();
        localStorage.setItem("clientId", clientId);
    }
    return clientId;
}