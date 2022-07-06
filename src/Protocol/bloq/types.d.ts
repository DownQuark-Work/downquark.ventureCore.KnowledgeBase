// declare type URLPattern = any;
export type qonstructorType = {
  index: number,
  hash: string,
  previousHash: string
  timestamp: number,
  data: string,
}

export type calculateHashType = Omit<qonstructorType, 'hash'>;