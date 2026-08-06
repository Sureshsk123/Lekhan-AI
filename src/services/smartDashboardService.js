import apiClient from './apiClient';

export const getSmartDashboard = async (language = null) => {
  const query = language ? `?language=${language}` : '';
  const res = await apiClient.get(`/dashboard/smart${query}`).catch(() =>
    apiClient.get(`/v1/dashboard/smart${query}`).catch(() =>
      apiClient.get(`/v1/dashboard${query}`).catch(() =>
        apiClient.get(`/dashboard${query}`)
      )
    )
  );
  return res.data;
};

export default {
  getSmartDashboard
};
