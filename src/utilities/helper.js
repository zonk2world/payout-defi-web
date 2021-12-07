import assetImg from "../styles/img/Assets.png";
import daiImg from "../styles/img/tokens/dai.png";
import usdcImg from "../styles/img/tokens/usdc.png";
import tusdImg from "../styles/img/tokens/tusd.png";
import pptImg from "../styles/img/tokens/ppt.png";
import pxtImg from "../styles/img/tokens/pxt.png";
import usdtImg from "../styles/img/tokens/usdt.png";
import ethImg from "../styles/img/tokens/eth.png";
import wbtcImg from "../styles/img/tokens/wbtc.png";
import paxImg from "../styles/img/tokens/pax.png";
import pDaiImg from "../styles/img/tokens/pdai.svg";
import pUsdcImg from "../styles/img/tokens/pusdc.svg";
import pTusdImg from "../styles/img/tokens/ptusd.svg";
import balancerImg from "../styles/img/tokens/balancer.png"
import bancorImg from "../styles/img/tokens/bancor.png"
import bzxImg from "../styles/img/tokens/bzx.png"
import compoundImg from "../styles/img/tokens/compound.png"
import croImg from "../styles/img/tokens/cro.png"
import curveImg from "../styles/img/tokens/curve.png"
import binanceImg from "../styles/img/tokens/binance.png"
import attentionImg from "../styles/img/tokens/attention.png"
import aaveImg from "../styles/img/tokens/aave.png"
import aragonImg from "../styles/img/tokens/aragon.png"
import uniImg from "../styles/img/tokens/uni.png"

import daiStakeImg from "../styles/img/stake/DAI.png"
import ethStakeImg from "../styles/img/stake/Ethereum.png"
import tusdStakeImg from "../styles/img/stake/TUSD.png"
import usdcStakeImg from "../styles/img/stake/USDC.png"
import usdtStakeImg from "../styles/img/stake/USDT.png"
import wbtcStakeImg from "../styles/img/stake/WBTC.png"

import millify from "millify";

export const tokenSymbol = (name) => {
    let icon;
    switch (name) {
        case "DAI": {
            icon = daiImg;
            break;
        }
        case "TUSD": {
            icon = tusdImg;
            break;
        }
        case "USDC": {
            icon = usdcImg;
            break;
        }
        case "PAX": {
            icon = paxImg;
            break;
        }
        case "PPT": {
            icon = pptImg;
            break;
        }
        case "PXT": {
            icon = pxtImg;
            break;
        }
        case "ETH": {
            icon = ethImg;
            break;
        }
        case "WBTC": {
            icon = wbtcImg;
            break;
        }
        case "PDAI": {
            icon = pDaiImg;
            break;
        }
        case "PTUSD": {
            icon = pTusdImg;
            break;
        }
        case "PUSDC": {
            icon = pUsdcImg;
            break;
        }
        case "USDT": {
            icon = usdtImg;
            break;
        }
        case "BAL": {
            icon = balancerImg;
            break;
        }
        case "BNT": {
            icon = bancorImg;
            break;
        }
        case "BZRX": {
            icon = bzxImg;
            break;
        }
        case "COMP": {
            icon = compoundImg;
            break;
        }
        case "CRO": {
            icon = croImg;
            break;
        }
        case "CRV": {
            icon = curveImg;
            break;
        }
        case "BUSD": {
            icon = binanceImg;
            break;
        }
        case "BAT": {
            icon = attentionImg;
            break;
        }
        case "AAVE": {
            icon = aaveImg;
            break;
        }
        case "ANT": {
            icon = aragonImg;
            break;
        }
        case "UNI": {
            icon = uniImg;
            break;
        }
        default:
            icon = assetImg;
    }
    return icon;
};

export const stakeImg = (name) => {
    switch (name) {
        case "DAI":
            return daiStakeImg;
        case "TUSD":
            return tusdStakeImg;
        case "USDC":
            return usdcStakeImg;
        case "ETH":
            return ethStakeImg;
        case "WBTC":
            return wbtcStakeImg;
        case "USDT":
            return usdtStakeImg;
        default:
            return tokenSymbol(name)
    }
}

export function beautyNumber(number) {
    if (isNaN(Number(number))) {
        return "0";
    }

    if (Number(number) > Number.MAX_SAFE_INTEGER) {
        const eCount = Math.floor(Math.log(Number(number)) / Math.log(10))
        const prefix = Number(number) / (Math.pow(10, eCount))
        return `${prefix.toFixed(2)}e+${eCount}`
    }

    if (Number(number) < 1000) {
        return Number(number).toFixed(2)
    }

    const formatted = millify(Number(number), {
        precision: 2,
        decimalSeparator: ".",
    });

    const num = formatted.match(/\d+/g)[0]
    const str = formatted.match(/[a-zA-Z]+/g)
    return `${Number(num).toFixed(2)}${str}`
}

export function beautyNumberDecimal(number) {
    if (isNaN(Number(number))) {
        return "0";
    }
    return number.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

export function make2decimal(number) {
    if (isNaN(Number(number))) {
        return 0;
    }
    number = number.toString(); //If it's not already a String
    number = number.slice(0, number.indexOf(".") + 3); //With 3 exposing the hundredths place
    return Number(number);
}

export function parseDate(date) {
    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    return months[date.getMonth()] + " " + date.getDate();
}

export const formattedNumber = (
    value,
    minimumFractionDigits = 2,
    maximumFractionDigits = 2
) => {
    return Number(value).toLocaleString("en-US", {
        minimumFractionDigits,
        maximumFractionDigits,
    });
};

export const timestampToDateTime = (timestamp) => {
    const d = new Date(timestamp);
    const date_format_str =
        d.getFullYear().toString() +
        "-" +
        ((d.getMonth() + 1).toString().length == 2
            ? (d.getMonth() + 1).toString()
            : "0" + (d.getMonth() + 1).toString()) +
        "-" +
        (d.getDate().toString().length == 2
            ? d.getDate().toString()
            : "0" + d.getDate().toString()) +
        " " +
        (d.getHours().toString().length == 2
            ? d.getHours().toString()
            : "0" + d.getHours().toString()) +
        ":" +
        ((parseInt(d.getMinutes() / 5) * 5).toString().length == 2
            ? (parseInt(d.getMinutes() / 5) * 5).toString()
            : "0" + (parseInt(d.getMinutes() / 5) * 5).toString()) +
        ":00";

    return date_format_str;
};
