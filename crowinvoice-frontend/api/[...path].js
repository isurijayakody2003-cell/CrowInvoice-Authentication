
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
const targetPath = req.url.replace(/^\/api/, "") || "/";
  const targetUrl = `https://tools.crowdemo.com${targetPath}`;

  try {
    const headers = {
      accept: req.headers.accept || "*/*",
    };

    if (req.headers["content-type"]) {
      headers["content-type"] = req.headers["content-type"];
    }

    if (req.headers.cookie) {
      headers.cookie = req.headers.cookie;
    }

    if (req.headers["user-agent"]) {
      headers["user-agent"] = req.headers["user-agent"];
    }

    const options = {
      method: req.method,
      headers,
      redirect: "manual",
    };

    if (!["GET", "HEAD"].includes(req.method)) {
      options.body = req;
      options.duplex = "half";
    }

    const response = await fetch(targetUrl, options);

    res.statusCode = response.status;

    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();

      if (
        ![
          "transfer-encoding",
          "content-encoding",
          "content-length",
          "set-cookie",
          "location",
        ].includes(lowerKey)
      ) {
        res.setHeader(key, value);
      }
    });

    // Preserve Laravel session and CSRF cookies
    const cookies = response.headers.getSetCookie?.() || [];

    if (cookies.length > 0) {
      res.setHeader("Set-Cookie", cookies);
    }

    // Keep redirects on the Vercel domain
    const location = response.headers.get("location");

    if (location) {
      const redirectUrl = new URL(location, targetUrl);

      if (redirectUrl.origin === "https://tools.crowdemo.com") {
        res.setHeader(
          "Location",
          redirectUrl.pathname + redirectUrl.search
        );
      } else {
        res.setHeader("Location", location);
      }
    }

    const data = Buffer.from(await response.arrayBuffer());
    res.end(data);

  } catch (error) {
    console.error("CrowInvoice Proxy Error:", error);

    res.status(502).json({
      message: "Unable to connect to CrowInvoice server.",
    });
  }
}
