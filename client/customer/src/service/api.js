const domain = process.env.REACT_APP_DOMAIN;
let token = null;
export const setToken = (value) => {
    token = value
}

let Api = () => { };
function request(params) {
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

Api.shop = {
    // product
    getProducts: function () {
        const requestParams = {
            url: `${domain}/shop/products`,
            config:
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        }
        return request(requestParams);
    },
    getProduct: function (productId) {
        const requestParams = {
            url: `${domain}/shop/product/${productId}`,
            config:
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        }
        return request(requestParams);
    },
    getProductByType: function (parentName) {
        const requestParams = requestParamsFunc(`/shop/${parentName}`, 'GET');
        return request(requestParams);
    },
    // featured product
    getFeaturedProducts: function (catalogValue) {
        const requestParams = requestParamsFunc(`/shop/featured-products/${catalogValue}`, "GET");
        return request(requestParams);
    },
    // postOrder: function (params) {
    //     console.log(params);
    //     const requestParams = requestParamsFunc(`/shop/Order`, 'POST', params);
    //     return request(requestParams);
    // },
    // order
    postOrder: function (params) {
        const requestParams = {
            url: `${domain}/shop/order`,
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
    udpateOrder: function (orderId, params) {
        const requestParams = requestParamsFunc(`/shop/Order/${orderId}`, 'PATCH', params);
        return request(requestParams);
    },
    // rate
    getRate: function (id) {
        const requestParams = requestParamsFunc(`/shop/rate/${id}`, 'GET');
        return request(requestParams);
    },
    // payment
    // product
    postPayment: function (params) {
        const requestParams = requestParamsFunc(`/payment/create_payment_url`, 'POST', params);
        return request(requestParams);
    },
    // voucher
    checkVoucher: function (params) {
        const requestParams = requestParamsFunc(`/shop/voucher-check`, 'POST', params);
        return request(requestParams);
    },
}
Api.user = {
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
    // this my own back end
    google_login: function (params) {
        const requestParams = requestParamsFunc(`/google-login`, 'POST', params);
        return request(requestParams);
    },
    signup: function (params) {
        // console.log(params);
        const requestParams = {
            url: `${domain}/signup`,
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
    getUser: function () {
        const requestParams = requestParamsFunc(`/user`, 'GET');
        return request(requestParams);
    },
    updateUser: function (params) {
        const requestParams = requestParamsFunc(`/user`, 'PATCH', params);
        return request(requestParams);
    },
    changePassword: function (params) {
        const requestParams = requestParamsFunc(`/user/changepw`, 'POST', params);
        return request(requestParams);
    },
    getCart: function () {
        const requestParams = {
            url: `${domain}/user/cart`,
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
    updateCart: function (params) {
        const requestParams = {
            url: `${domain}/user/cart`,
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
    getOrders: function () {
        const requestParams = {
            url: `${domain}/user/order`,
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
    // rate
    getRate: function (rateId, orderId) {
        const requestParams = requestParamsFunc(`/user/evaluate-product/${rateId}?orderId=${orderId}`, 'GET');
        return request(requestParams);
    },
    updateRate: function (rateId, params) {
        const requestParams = requestParamsFunc(`/user/evaluate-product/${rateId}`, 'PATCH', params);
        return request(requestParams);
    },
    rate: function (params) {
        // star, productId, comment
        const requestParams = requestParamsFunc(`/user/evaluate-product`, 'POST', params);
        return request(requestParams);
    }
}

export default Api;