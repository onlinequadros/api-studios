export interface IPaymentPixParams {
  payment_type?: string;
  customer_id?: string;
  order_id?: string;
  payment_id?: string;
  amount?: string;
  status?: string;
  transaction_id?: string;
  transaction_timestamp?: string;
  receiver_psp_name?: string;
  receiver_psp_code?: string;
  receiver_name?: string;
  receiver_cnpj?: string;
  receiver_cpf?: string;
  terminal_nsu?: string;
}
