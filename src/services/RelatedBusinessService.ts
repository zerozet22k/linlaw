import { RelatedBusiness } from "@/models/RelatedBusinessModel";
import { relatedBusinessRepository, toObjectId } from "@/repositories";

class RelatedBusinessService {
  async getAllBusinesses(
    searchQuery = "",
    page?: number,
    limit?: number,
    selected: string[] = [],
    includeInactive = false
  ): Promise<{ businesses: RelatedBusiness[]; hasMore: boolean }> {
    const selectedObjectIds = selected.map((id) => toObjectId(id));
    return relatedBusinessRepository.findAll(
      searchQuery,
      page,
      limit,
      selectedObjectIds,
      includeInactive
    );
  }

  async getBusinessById(id: string): Promise<RelatedBusiness | null> {
    return relatedBusinessRepository.findById(toObjectId(id));
  }

  async getBusinessesByIds(ids: string[]): Promise<RelatedBusiness[]> {
    const objectIds = ids.map((id) => toObjectId(id));
    return relatedBusinessRepository.findByIds(objectIds);
  }

  async getBusinessesByIdsPreserveOrder(
    ids: string[]
  ): Promise<RelatedBusiness[]> {
    const objectIds = ids.map((id) => toObjectId(id));
    return relatedBusinessRepository.findByIdsPreserveOrder(objectIds);
  }

  async getBusinessBySlug(
    slug: string,
    includeInactive = false
  ): Promise<RelatedBusiness | null> {
    return relatedBusinessRepository.findBySlug(slug, includeInactive);
  }

  async createBusiness(data: Partial<RelatedBusiness>): Promise<RelatedBusiness> {
    return relatedBusinessRepository.create(data);
  }

  async updateBusiness(
    id: string,
    data: Partial<RelatedBusiness>
  ): Promise<RelatedBusiness | null> {
    return relatedBusinessRepository.update(toObjectId(id), data);
  }

  async deleteBusiness(id: string): Promise<RelatedBusiness | null> {
    return relatedBusinessRepository.delete(toObjectId(id));
  }
}

export default RelatedBusinessService;
