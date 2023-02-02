import * as moment from 'moment';

const formatSettlementDate = (createdAt, expectedTenure) => {
  if (!createdAt) {
    return 'N/A';
  }
  const createdDate = new Date(createdAt);
  return moment(createdDate).add(expectedTenure, 'days').format('DD/MM/YYYY');
};
export default formatSettlementDate;
