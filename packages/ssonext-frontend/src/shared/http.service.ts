export class HttpService {
  constructor(
    private baseUrl: string,
    private tokenKey = 'TOKEN',
    private options = {
      beforeRequest: () => {},
      afterRequest: () => {}
    }
  ) {}

  async get(url: string, progress?: (percentage, loaded?, total?) => void) {
    try {
      return await this.makeRequest(
        { method: 'GET', url: this.baseUrl + url },
        true,
        progress
      );
    } catch (e) {
      return e.response || { error: true };
    }
  }

  async post(url: string, body: any) {
    try {
      return await this.makeRequest(
        { method: 'POST', url: this.baseUrl + url, body },
        true
      );
    } catch (e) {
      return e.response || { error: true };
    }
  }

  async makeRequest(
    request: { method: 'GET' | 'POST'; headers?: any; body?; url: string },
    loginRequired = false,
    progress?: (percentage, loaded?, total?) => void
  ) {
    const onBefore = () => {
      if (this.options?.beforeRequest) {
        try {
          this.options?.beforeRequest();
        } catch {}
      }
    };
    const onAfter = () => {
      if (this.options?.afterRequest) {
        try {
          this.options?.afterRequest();
        } catch {}
      }
    };

    onBefore();

    const options: any = {
      method: request.method,
      headers: { ...request.headers }
    };

    if (request.method == 'POST') {
      options.body = JSON.stringify(request.body);
      options.headers['Content-Type'] = 'application/json';
    }

    if (loginRequired && localStorage.getItem(this.tokenKey)) {
      options.headers['Authorization'] = `Bearer ${localStorage.getItem(this.tokenKey)}`;
    }

    let promise: Promise<any> = new Promise((res, rej) => {
      let xhr = new XMLHttpRequest();
      xhr.open(options.method || 'GET', request.url, true);
      if (options.headers) {
        Object.keys(options.headers).forEach((key) => {
          xhr.setRequestHeader(key, options.headers[key]);
        });
      }
      xhr.onprogress = (e) => {
        if (progress && e.lengthComputable) {
          progress(e.loaded / e.total, e.loaded, e.total);
        }
      };
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          let result = xhr.response;
          try {
            result =
              typeof xhr.response === 'string' ? JSON.parse(xhr.response) : xhr.response;
          } catch (e) {
            //ignore
          }
          if (progress) {
            progress(1); // indicate request has finished to non supported progress requests
          }
          res(result);
          onAfter();
        } else {
          let result = xhr.response;
          try {
            result =
              typeof xhr.response === 'string' ? JSON.parse(xhr.response) : xhr.response;
          } catch (e) {
            //ignore
          }
          rej({ statusText: xhr.statusText, status: xhr.status, response: result });
          onAfter();
        }
      };
      xhr.onerror = () => rej(xhr.statusText);
      try {
        request.method == 'POST' ? xhr.send(options.body) : xhr.send();
      } catch (e) {
        rej(e);
        onAfter();
      }
    });

    return promise;
  }
}

export function jsonToQueryString(json, excludeQuestionMark = false) {
  return (
    (excludeQuestionMark ? '' : '?') +
    Object.keys(json)
      .map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
      })
      .join('&')
  );
}
