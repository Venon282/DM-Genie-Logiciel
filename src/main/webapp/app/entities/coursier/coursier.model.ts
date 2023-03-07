export interface ICoursier {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  email?: string | null;
  vehicleType?: string | null;
  activated?: boolean | null;
}

export type NewCoursier = Omit<ICoursier, 'id'> & { id: null };
