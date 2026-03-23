import type { Career } from "@/models/CareerModel";
import CareerRepository from "@/repositories/CareerRepository";
import { toObjectId } from "@/repositories";

class CareerService {
  private careerRepository: CareerRepository;

  constructor() {
    this.careerRepository = new CareerRepository();
  }

  async getAllCareers(
    searchQuery = "",
    page?: number,
    limit?: number,
    selected: string[] = [],
    includeInactive = false
  ): Promise<{ careers: Career[]; hasMore: boolean }> {
    const selectedIds = selected.map((id) => toObjectId(id));
    return this.careerRepository.findAll(
      searchQuery,
      page,
      limit,
      selectedIds,
      includeInactive
    );
  }

  async getCareerById(id: string): Promise<Career | null> {
    return this.careerRepository.findById(toObjectId(id));
  }
  async createCareer(data: Partial<Career>): Promise<Career> {
    return this.careerRepository.create(data);
  }

  async updateCareer(
    id: string,
    data: Partial<Career>
  ): Promise<Career | null> {
    return this.careerRepository.update(toObjectId(id), data);
  }

  async deleteCareer(id: string): Promise<Career | null> {
    return this.careerRepository.delete(toObjectId(id));
  }
}

export default CareerService;
