export interface AccountBankData {
  id: string;
  type_account_bank?: 'CORRENTE' | 'POUPANCA';
  name_bank?: string;
  agency_bank?: string;
  digit_agency_bank?: string;
  account_bank?: string;
  digit_account_bank?: string;
  account_pix_bank?: string;
}
