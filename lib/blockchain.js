
const params = {
  LAST_POW_BLOCK: 291, // 345600
  RAMP_TO_BLOCK: 0,
  LAST_SEESAW_BLOCK: 0
};

const avgBlockTime = 60; // 1 minute (60 seconds)

const blocksPerDay = (24 * 60 * 60) / avgBlockTime; // 1440

const blocksPerWeek = blocksPerDay * 7; // 10080

const blocksPerMonth = (blocksPerDay * 365.25) / 12; // 306810

const blocksPerYear = blocksPerDay * 365.25; // 3681720

const mncoins = 1000.0;

const getMNBlocksPerDay = (mns) => {
  return blocksPerDay / mns;
};

const getMNBlocksPerWeek = (mns) => {
  return getMNBlocksPerDay(mns) * (365.25 / 52);
};

const getMNBlocksPerMonth = (mns) => {
  return getMNBlocksPerDay(mns) * (365.25 / 12);
};

const getMNBlocksPerYear = (mns) => {
  return getMNBlocksPerDay(mns) * 365.25;
};

const getMNSubsidy = (nHeight = 0, nMasternodeCount = 0, nMoneySupply = 0) => {
  const blockValue = getSubsidy(nHeight);
  let ret = 0.0;

	if (nHeight <= 100) {
    ret = blockValue  / 100 * 0;               // %0
} else if (nHeight > 100 ) {
  ret = blockValue  / 100 * 90;               // %90
}



  return ret;
};

const getSubsidy = (nHeight = 1) => {
  let nSubsidy = 0.0;
  let nSlowSubsidy = 50.0;
  if (nHeight == 1) {
    nSubsidy = 3000000;
} else if  (nHeight <= params.LAST_POW_BLOCK  && nHeight >= 3) {
     nSubsidy = 3;
} else if (nHeight <= 1728 && nHeight > params.LAST_POW_BLOCK ) {
 nSubsidy = 2;
} else if (nHeight <= 4608 && nHeight > 1728) {
 nSubsidy = 5;
} else if (nHeight <= 8928 && nHeight > 4608) {
 nSubsidy = 10;
} else if (nHeight <= 11808 && nHeight > 8928) {
 nSubsidy = 25;
} else if (nHeight <= 16128 && nHeight > 11808) {
   nSubsidy = 70;
} else if (nHeight <= 19008 && nHeight > 16128) {
   nSubsidy = 100;
} else if (nHeight > 19008) {
   nSubsidy = 200;
} else {
   nSubsidy = 0.1;
}
  return  nSubsidy;
};

const getROI = (subsidy, mns) => {
  return ((getMNBlocksPerYear(mns) * subsidy) / mncoins) * 100.0;
};

const isAddress = (s) => {
  return typeof(s) === 'string' && s.length === 34;
};

const isBlock = (s) => {
  return !isNaN(s) || (typeof(s) === 'string');
};

const isPoS = (b) => {
  return !!b && b.height > params.LAST_POW_BLOCK; // > 182700
};

const isTX = (s) => {
  return typeof(s) === 'string' && s.length === 64;
};

module.exports = {
  avgBlockTime,
  blocksPerDay,
  blocksPerMonth,
  blocksPerWeek,
  blocksPerYear,
  mncoins,
  params,
  getMNBlocksPerDay,
  getMNBlocksPerMonth,
  getMNBlocksPerWeek,
  getMNBlocksPerYear,
  getMNSubsidy,
  getSubsidy,
  getROI,
  isAddress,
  isBlock,
  isPoS,
  isTX
};
