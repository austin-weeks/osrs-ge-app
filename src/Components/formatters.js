
export function formatGP(gp) {
  const mil = 10000000;
  const k = 100000;
  if (gp >= mil) {
    const money = Math.floor(gp / 1000000);
    return {
      gp: `${money}M`,
      text: 'text-[#14d814]'
    }
  } else if (gp >= k) {
    const money = Math.floor(gp /1000);
    return {
      gp: `${money}K`,
      text: 'text-white'
    }
  }
  else {
    return {
      gp: `${gp} gp`,
      text: ''
    }
  }
}
