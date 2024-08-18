
export function formatDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[date.getUTCMonth()]} ${date.getUTCDate()} ${date.getUTCFullYear()}`;
}

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

export function formatPrice(price) {
  const mil = 10000000;
  const k = 100000;
  if (price >= mil) {
    const money = Math.floor(price / 1000000);
    return `${money}M`;
  } else if (price >= k) {
    const money = Math.floor(price / 1000);
    return `${money}K`;
  }
  else {
    return `${price}`;
  }
}

export function formatVolume(volume) {
  const mil = 10000000;
  const k = 100000;
  if (volume >= mil) {
    const vol = Math.floor(volume / 1000000);
    return `${vol}M`;
  } else if (volume >= k) {
    const vol = Math.floor(volume / 1000);
    return `${vol}K`;
  }
  else {
    return `${volume}`;
  }
}
