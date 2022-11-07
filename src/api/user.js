import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/base/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/base/logout',
    method: 'get'
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get'
  })
}

export function captcha() {
  return request({
    url: '/base/captcha',
    method: 'get'
  })
}

export function changePassword(parameter) {
  return request({
    url: '/user/changePassword',
    method: 'post',
    data: parameter
  })
}
