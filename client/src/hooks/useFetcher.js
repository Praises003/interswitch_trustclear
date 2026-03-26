import api from "../api/client";

export const fetcher = (url) => api.get(url).then(res => res.data);