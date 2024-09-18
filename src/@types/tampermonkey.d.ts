declare namespace TampermonkeyTypes {
  interface GMXMLHttpRequestDetails {
    method?: "GET" | "POST" | "HEAD";
    url: string;
    headers?: { [key: string]: string };
    data?: string;
    onload?: (response: GMXMLHttpRequestResponse) => void;
    onerror?: (response: GMXMLHttpRequestResponse) => void;
    onabort?: (response: GMXMLHttpRequestResponse) => void;
    ontimeout?: (response: GMXMLHttpRequestResponse) => void;
  }

  interface GMXMLHttpRequestResponse {
    responseText: string;
    readyState: number;
    status: number;
    statusText: string;
    responseHeaders: string;
    finalUrl: string;
  }

  function GM_xmlhttpRequest(details: GMXMLHttpRequestDetails): void;
}

declare function GM_xmlhttpRequest(details: TampermonkeyTypes.GMXMLHttpRequestDetails): void;