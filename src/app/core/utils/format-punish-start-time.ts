import * as moment from 'moment';

const formatPunishStartTimeHmg = (createdAt, expectedTenure) => {
  if (!createdAt) {
    return 'N/A';
  }

  const createdDate = new Date(createdAt);
  return (
    '00h Ngày ' +
    moment(createdDate)
      .add(parseInt(expectedTenure) + 4, 'days')
      .format('DD/MM/YYYY')
  );
};

export default formatPunishStartTimeHmg;
