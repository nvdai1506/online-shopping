export const DBConfig = {
  name: 'MyDB',
  version: 1,
  objectStoresMeta: [
    {
      store: 'cart',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { cart: 'cart', keyPath: 'cart', options: { unique: false } }
      ]
    }
  ]
};