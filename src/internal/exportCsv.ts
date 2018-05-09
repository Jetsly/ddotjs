
export default (data: string, name) => {
  const prefix = '\uFEFF'
  const blob = new Blob([`${prefix}${data}`], {
    type: 'text/csv;charset=utf-8'
  })
  const a = document.createElement('a')
  a.download = `${name || '数据'}.csv`
  a.href = URL.createObjectURL(blob)
  a.click()
}
