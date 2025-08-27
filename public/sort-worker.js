// 处理大规模数组排序的 Worker
self.onmessage = function (e) {
  const { data, type } = e.data

  if (type === 'sort') {
    const startTime = performance.now()

    // 执行大规模数组排序
    const sortedData = data.sort((a, b) => a - b)

    const endTime = performance.now()

    // 返回排序结果
    self.postMessage({
      type: 'sort-complete',
      result: sortedData,
      time: endTime - startTime
    })
  }
}
