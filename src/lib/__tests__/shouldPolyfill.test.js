import cases from "jest-in-case";

cases(
  "shouldPolyfill",
  opts => {
    jest.resetModules();

    Object.defineProperty(window, "top", {
      value: opts.simulateIframe ? {} : window,
      configurable: true,
      writable: true
    });

    Object.defineProperty(window.navigator, "userAgent", {
      value: opts.userAgent,
      configurable: true
    });
    const wouldPolyfill = require("../shouldPolyfill").default;
    expect(wouldPolyfill).toBe(opts.shouldPolyfill);
  },
  [
    {
      name: "Chrome 14",
      shouldPolyfill: true,
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_2) AppleWebKit/535.1 (KHTML, like Gecko) Chrome/14.0.835.186 Safari/535.1"
    },
    {
      name: "Chrome 20",
      shouldPolyfill: true,
      userAgent:
        "Mozilla/5.0 (X11; CrOS i686 2268.111.0) AppleWebKit/536.11 (KHTML, like Gecko) Chrome/20.0.1132.57 Safari/536.11"
    },
    {
      name: "Chrome 21",
      shouldPolyfill: false,
      userAgent:
        "Mozilla/5.0 (Windows NT 10.2; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.89 Safari/537.1"
    },
    {
      name: "Chrome 68",
      shouldPolyfill: false,
      userAgent:
        "Mozilla/5.0 (Windows; U; Windows NT 10.0; en-US) AppleWebKit/604.1.38 (KHTML, like Gecko) Chrome/68.0.3325.162"
    },
    {
      name: "Firefox 4",
      shouldPolyfill: false,
      userAgent:
        "Mozilla/5.0 (X11; Arch Linux i686; rv:2.0) Gecko/20110321 Firefox/4.0"
    },
    {
      name: "Firefox 40.1",
      shouldPolyfill: false,
      userAgent:
        "Mozilla/5.0 (Windows NT 6.1; WOW64; rv:40.0) Gecko/20100101 Firefox/40.1"
    },
    {
      name: "Opera 23",
      shouldPolyfill: false,
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1985.125 Safari/537.36 OPR/23.0.1522.60"
    },
    {
      name: "Opera 53",
      shouldPolyfill: false,
      userAgent:
        "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36 OPR/53.0.2907.106"
    },
    {
      name: "Android 4.1",
      shouldPolyfill: true,
      userAgent:
        "Mozilla/5.0 (Linux; U; Android 4.1.2; en-US; B1-710 Build/JZO54K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.1 Safari/534.30"
    },
    {
      name: "Android 4.4",
      shouldPolyfill: true,
      userAgent:
        "Mozilla/5.0 (Linux; U; Android 4.4; es-us; ) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.4 Mobile Safari/534.30"
    },
    {
      name: "Chrome Mobile 40",
      shouldPolyfill: false,
      userAgent:
        "Mozilla/5.0 (Linux; Android 8.4.2; SM-J100H Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.109 Mobile Safari/537.36"
    },
    {
      name: "iOS 6",
      shouldPolyfill: true,
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 6_0_2 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A551 Safari/8536.25"
    },
    {
      name: "iOS 8.1",
      shouldPolyfill: false,
      userAgent:
        "Mozilla/5.0 (iPhone; CPU iPhone OS 8_1_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12B440 Safari/600.1.4"
    },
    {
      name: "Safari 6",
      shouldPolyfill: true,
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8) AppleWebKit/536.26.17 (KHTML like Gecko) Version/6.0.2 Safari/536.26.17"
    },
    {
      name: "Safari 7.1",
      shouldPolyfill: false,
      userAgent:
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 1095) AppleWebKit/600.1.17 (KHTML like Gecko) Version/7.1 Safari/537.85.10"
    },
    {
      name: "Edge 12",
      shouldPolyfill: true,
      userAgent:
        "Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2679.0 Safari/537.36 Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246"
    },
    {
      name: "Edge 13",
      shouldPolyfill: false,
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.14251"
    },
    {
      name: "Edge 13 in <iframe>",
      shouldPolyfill: true,
      simulateIframe: true,
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.14251"
    },
    {
      name: "IE 9",
      shouldPolyfill: true,
      userAgent:
        "Mozilla/5.0 (compatible; MSIE 9.0; InfoChannel RNSafeBrowser/v.1.1.0G)"
    },
    {
      name: "IE 11",
      shouldPolyfill: true,
      userAgent:
        "Mozilla/5.0 (compatible, MSIE 11, Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko"
    }
  ]
);
