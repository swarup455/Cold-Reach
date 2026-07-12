import api from "./axiosInstance";

export interface GoogleConnectionStatus {
    gmailConnected: boolean;
}

export const connectGoogle = async () => {
    const res = await api.get("/google/connect");

    window.location.href = res.data.data.url;
};

export const getGoogleConnectionStatus = async () => {
    const res = await api.get("/google/status");
    return res.data.data as GoogleConnectionStatus;
};

export const disconnectGoogle = async () => {
    const res = await api.delete("/google/disconnect");
    return res.data;
};