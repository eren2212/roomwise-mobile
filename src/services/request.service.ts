import api from "./api";
import {
  HouseRequest,
  HouseRequestWithProfile,
  CreateRequestDto,
  RequestApiResponse,
} from "../types/request.types";

class RequestService {
  /**
   * Ev isteği gönder
   */
  async createRequest(
    data: CreateRequestDto,
    token: string,
  ): Promise<RequestApiResponse<HouseRequest>> {
    const response = await api.post("/request", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  /**
   * Eve gelen istekleri getir
   */
  async getRequestsForHouse(
    houseId: string,
    token: string,
  ): Promise<RequestApiResponse<HouseRequestWithProfile[]>> {
    const response = await api.get(`/request/house/${houseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  /**
   * Bekleyen istek sayısını getir
   */
  async getPendingRequestCount(
    token: string,
  ): Promise<RequestApiResponse<{ count: number }>> {
    const response = await api.get("/request/pending-count", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  /**
   * İstek detayını getir
   */
  async getRequestById(
    requestId: string,
    token: string,
  ): Promise<RequestApiResponse<HouseRequestWithProfile>> {
    const response = await api.get(`/request/${requestId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }

  /**
   * İstek durumunu güncelle (kabul/red)
   */
  async updateRequestStatus(
    requestId: string,
    status: "verified" | "rejected",
    token: string,
  ): Promise<RequestApiResponse<HouseRequest>> {
    const response = await api.patch(
      `/request/${requestId}/status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  }
}

export default new RequestService();
