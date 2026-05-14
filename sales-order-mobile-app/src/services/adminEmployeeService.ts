import { createUserAsAdmin } from './authService';
import { createUserProfile } from './userService';

type JobType = 'Sales Representative' | 'Warehouse Keeper';

export type AdminCreateEmployeeInput = {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  startDate: string;
  jobType: JobType;
  salesLine?: string;
};

export async function adminCreateEmployee(input: AdminCreateEmployeeInput) {
  const user = await createUserAsAdmin(input.email, input.password);

  const normalizedJob = input.jobType;
  const role = normalizedJob === 'Warehouse Keeper' ? 'warehouse' : 'sales';

  await createUserProfile(user.uid, {
    fullName: input.fullName,
    email: input.email,
    phone: input.phone,
    address: input.address,
    jobType: input.jobType,
    role,
    salesLine: role === 'sales' ? input.salesLine || '' : '',
    startDate: input.startDate,
  });

  return user.uid;
}

