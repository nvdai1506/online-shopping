const domain = process.env.REACT_APP_DOMAIN;

let Api = () => { };
let token = null;

export function setToken(value) {
    token = value;
}


function request(params) {
    // console.log(token);
    return new Promise(async (resolve, reject) => {
        // console.log(params);
        let res = await fetch(params.url, params.config).catch(res => ({
            ...res.response,
            error: res.message
        }));
        // console.log(res);

        if (res && (res.status >= 200 && res.status < 300)) {
            return resolve(res);
        }
        else if (res && res.status === 401) {
            let refreshToken = localStorage.getItem("x-refreshToken");
            if (token && refreshToken) {
                // console.log('accessToken:', token);
                // console.log('refreshToken:',refreshToken);
                let refresh = await fetch(`${domain}/refresh`, {
                    method: "POST",
                    body: JSON.stringify({
                        accessToken: token,
                        refreshToken: refreshToken
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).catch(res => ({
                    ...res.response,
                    error: res.message
                }));
                // console.log(refresh);
                if (refresh && refresh.status === 200) {
                    const data = await refresh.json();
                    token = data.newAccessToken;
                    // console.log('token: ', token);
                    localStorage.setItem("x-access-token", token);
                    params.config.headers["x-access-token"] = token;
                    // params.headers.set["x-access-token"] = token;
                    return resolve(fetch(params.url, params.config));
                } else {
                    return reject(refresh);
                }

            } else {
                return reject(res);
            }
        } else {
            return reject(res);
        }

    })
}
function requestParamsFunc(endpoint, method, params) {
    const url = `${domain}${endpoint}`
    const body = JSON.stringify(params);
    const headers = {
        'x-access-token': token,
        'Content-Type': 'application/json'
    }

    if (method === 'GET' || method === "DELETE") {
        return {
            url: url,
            config:
            {
                method: method,
                headers: headers,
            }
        }
    } else {
        return {
            url: url,
            config:
            {
                method: method,
                body: body,
                headers: headers,
            }
        }
    }
}
Api.admin = {
    login: function (params) {
        // console.log(params);
        const requestParams = {
            url: `${domain}/login`,
            config:
            {
                method: 'POST',
                body: JSON.stringify(params),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        }
        return request(requestParams);
    },
    // management Account
    getManagementAccount: function () {
        const requestParams = {
            url: `${domain}/admin/account`,
            config:
            {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            }
        }
        return request(requestParams);
    },
    addManagementAccount: function (params) {
        const requestParams = {
            url: `${domain}/admin/account`,
            config:
            {
                method: 'POST',
                body: JSON.stringify(params),
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            }
        }
        return request(requestParams);
    },
    deleteManagementAccount: function (id) {
        const requestParams = {
            url: `${domain}/admin/account/${id}`,
            config:
            {
                method: 'DELETE',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            }
        }
        return request(requestParams);
    },
    // catalog
    addCatalog: function (params) {
        const requestParams = {
            url: `${domain}/admin/catalog`,
            config:
            {
                method: 'POST',
                body: JSON.stringify(params),
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            }
        }
        return request(requestParams);
    },
    deleteCatalog: function (id) {
        const requestParams = {
            url: `${domain}/admin/catalog/${id}`,
            config:
            {
                method: 'DELETE',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            }
        }
        return request(requestParams);
    },
    updateCatalog: function (params, id) {
        const requestParams = {
            url: `${domain}/admin/catalog/${id}`,
            config:
            {
                method: 'PATCH',
                body: JSON.stringify(params),
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            }
        }
        return request(requestParams);
    },
    // child catalog
    addChildCatalog: function (params) {
        const requestParams = {
            url: `${domain}/admin/childcatalog`,
            config:
            {
                method: 'POST',
                body: JSON.stringify(params),
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            }
        }
        return request(requestParams);
    },
    updateChildCatalog: function (params, id) {
        const requestParams = {
            url: `${domain}/admin/childCatatlog/${id}`,
            config:
            {
                method: 'PATCH',
                body: JSON.stringify(params),
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            }
        }
        return request(requestParams);
    },
    deleteChildCatalog: function (id) {
        const requestParams = {
            url: `${domain}/admin/childcatalog/${id}`,
            config:
            {
                method: 'DELETE',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            }
        }
        return request(requestParams);
    },
    // <<<<<<<<<<<<product>>>>>>>>>>>>>>>
    addProduct: function (params) {
        const requestParams = {
            url: `${domain}/admin/product`,
            config:
            {
                method: 'POST',
                body: params,
                headers: {
                    'x-access-token': token,
                }
            }
        }
        return request(requestParams);
    },
    updateProduct: function (params, id) {
        // console.log('update product');
        const requestParams = {
            url: `${domain}/admin/product/${id}`,
            config:
            {
                method: 'PATCH',
                body: params,
                headers: {
                    'x-access-token': token
                }
            }
        }
        // console.log(params);
        return request(requestParams);
    },
    deletetProduct: function (id) {
        const requestParams = {
            url: `${domain}/admin/product/${id}`,
            config:
            {
                method: 'DELETE',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            }
        }
        return request(requestParams);
    },
    // featured product
    addFeaturedProduct: function (params) {
        const requestParams = requestParamsFunc('/admin/featured-product', 'POST', params);
        return request(requestParams);
    },
    deletetFeaturedProduct: function (id) {
        const requestParams = requestParamsFunc(`/admin/featured-product/${id}`, 'DELETE');
        return request(requestParams);
    },
    // on sale
    onSale: function (id, params) {
        const requestParams = requestParamsFunc(`/admin/sale-product/${id}`, 'PATCH', params);
        return request(requestParams);
    },
    // <<<<<<<<<<<<order>>>>>>>>>>>>>>>
    getOrders: function (status) {
        const requestParams = {
            url: `${domain}/admin/order/${status}`,
            config:
            {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            }
        }
        return request(requestParams);
    },
    updateOrder: function (params, id) {
        // console.log('update product');
        const requestParams = {
            url: `${domain}/admin/order/${id}`,
            config:
            {
                method: 'PATCH',
                body: JSON.stringify(params),
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            }
        }
        // console.log(params);
        return request(requestParams);
    },
    // overview
    getOverview: function (params) {
        const requestParams = {
            url: `${domain}/admin/overview`,
            config:
            {
                method: 'POST',
                body: JSON.stringify(params),
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            }
        }
        return request(requestParams);
    },
    getHistory: function () {
        const requestParams = {
            url: `${domain}/admin/history`,
            config:
            {
                method: 'GET',
                headers: {
                    'x-access-token': token,
                    'Content-Type': 'application/json'
                }
            }
        }
        return request(requestParams);
    },
    // voucher
    addVoucher: function (params) {
        const requestParams = requestParamsFunc('/admin/voucher', 'POST', params);
        return request(requestParams);
    },
    getVouchers: function () {
        const requestParams = requestParamsFunc('/admin/voucher', 'GET');
        return request(requestParams);
    },
    deleteVoucher: function (voucherId) {
        const requestParams = requestParamsFunc(`/admin/voucher/${voucherId}`, 'DELETE');
        return request(requestParams);
    },
}

Api.shop = {
    getCatalog: function () {
        const requestParams = {
            url: `${domain}/shop/catalog`,
            config:
            {
                method: 'GET'
            }
        }
        return request(requestParams);
    },
    getProducts: function () {
        const requestParams = {
            url: `${domain}/shop/products`,
            config:
            {
                method: 'GET'
            }
        }
        return request(requestParams);
    },
}

export default Api;