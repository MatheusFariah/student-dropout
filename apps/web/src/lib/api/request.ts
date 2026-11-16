interface ApiRequestOptions {
  timeout?: number;
  method?: "GET" | "POST";
  body?: unknown;
}

export async function fetchApi<ReturnType>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<ReturnType> {
  const apiUrl =
    process.env.API_URL ??
    "http://127.0.0.1:8000";

  const timeout =
    options.timeout ?? 30000;

  const method =
    options.method ?? "GET";

  const requestUrl =
    `${apiUrl}${path}`;

  const requestStartedAt =
    performance.now();

  console.log(
    `[API] START ${method} ${requestUrl}`,
  );

  const abortController =
    new AbortController();

  const timeoutIdentifier =
    setTimeout(() => {
      abortController.abort();
    }, timeout);

  try {
    const response = await fetch(
      requestUrl,
      {
        method,
        cache: "no-store",
        signal:
          abortController.signal,
        headers:
          options.body !== undefined
            ? {
                "Content-Type":
                  "application/json",
              }
            : undefined,
        body:
          options.body !== undefined
            ? JSON.stringify(
                options.body,
              )
            : undefined,
      },
    );

    const responseDuration =
      Math.round(
        performance.now() -
          requestStartedAt,
      );

    console.log(
      `[API] RESPONSE ${response.status} ${path} ${responseDuration}ms`,
    );

    if (!response.ok) {
      const responseText =
        await response.text();

      throw new Error(
        `Erro ${response.status} em ${path}: ${responseText}`,
      );
    }

    const responseData: ReturnType =
      await response.json();

    const totalDuration =
      Math.round(
        performance.now() -
          requestStartedAt,
      );

    console.log(
      `[API] SUCCESS ${path} ${totalDuration}ms`,
    );

    return responseData;
  } catch (error) {
    const totalDuration =
      Math.round(
        performance.now() -
          requestStartedAt,
      );

    if (
      error instanceof Error &&
      error.name === "AbortError"
    ) {
      throw new Error(
        `Timeout em ${path} após ${totalDuration}ms`,
      );
    }

    console.log(
      `[API] FAILED ${path} ${totalDuration}ms`,
    );

    throw error;
  } finally {
    clearTimeout(
      timeoutIdentifier,
    );
  }
}