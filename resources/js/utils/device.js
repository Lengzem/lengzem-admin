import { UAParser } from "ua-parser-js";

export function getDeviceInfo() {
    const parser = new UAParser();
    const result = parser.getResult();

    return {
        device_id: result.device.vendor || result.os.name || "Unknown Device",
        deviceName: result.device.model || result.device.vendor || result.os.name || "Unknown",
        os: `${result.os.name} ${result.os.version || ""}`,
        browser: `${result.browser.name} ${result.browser.version || ""}`,
        isMobile: result.device.type === "mobile",
        isTablet: result.device.type === "tablet",
        isDesktop: !result.device.type, // If no type, assume desktop
    };
}

