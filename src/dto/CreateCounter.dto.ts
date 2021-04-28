import { CompanyModel } from 'src/modules/company/models/company.model';

export interface CreateCounterDTO {
	username: string;
	password: string;
	currentVersion: string;
	company: CompanyModel;
}
