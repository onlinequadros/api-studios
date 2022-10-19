export function checkCompany(request) {
  return request.url.split('/').slice(0, 2).pop();
}
