---
hide_title: true
sidebar_position: 11
sidebar_label: Translation-ID
---

Zustand是一个简明、快速和状态管理库,它是以hooks为基础的。
安装Zustand或者在[这里](https://codesandbox.io/s/dazzling-moon-itop4)尝试一下。

```bash
npm install zustand
```

### Membuat store

Store adalah *hook* yang dapat digunakan dalam bentuk: primitif, objek dan fungsi, dalam hal ini fungsi `set` digunakan untuk *mengubah* state.

```jsx
import create from 'zustand'

const useStore = create(set => ({
  bears: 0,
  increasePopulation: () => set(state => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 })
}))
```

### Gunakan langsung ke dalam Komponen

Gunakan *hook* di mana saja, tidak dibutuhkan *providers*.  Pilih state dan komponen akan dimuat ulang ketika ada perubahan.

```jsx
function BearCounter() {
  const bears = useStore(state => state.bears)
  return <h1>{bears} around here ...</h1>
}

function Controls() {
  const increasePopulation = useStore(state => state.increasePopulation)
  return <button onClick={increasePopulation}>one up</button>
}
```

#### Perbedaan Zustand dengan react-redux?

* Ringkas dan mudah
* Menjadikan *hooks* sebagai bagian yang utama ketika menggunakan *state*
* Tidak membutuhkan konteks *providers* ketika membungkus sebuah aplikasi
* [Dapat mengirimkan informasi pada komponen (tanpa terjadi render)](#Updates-sementara-sering-digunakan-pada-perubahan-state))

---

# Beberapa cara menggunakan Zustand

## Mengambil store

Cara di bawah dapat digunakan, namun perlu diingat, komponen akan diperbarui ketika *state* berubah.

```jsx
const state = useStore()
```

## Memilih berbagai state

Cara berikut akan mendeteksi ketika ada perubahan secara *default* (sebelum === sesudah), hal ini efisien untuk mengambil suatu bagian dari *state*.

```jsx
const nuts = useStore(state => state.nuts)
const honey = useStore(state => state.honey)
```

Jika ingin membuat objek tunggal dan di dalamnya menggunakan pengambilan berbagai *state*, seperti mapStateToProps yang terdapat pada *redux*, Zustand dapat melakukannya dengan menggunakan *shallow* sebagai pilihan.

```jsx
import shallow from 'zustand/shallow'

// Mengambil Objek, komponen akan dimuat ulang ketika ada perubahan baik pada state.nuts atau state.honey
const { nuts, honey } = useStore(state => ({ nuts: state.nuts, honey: state.honey }), shallow)

// Mengambil Array, komponen akan dimuat ulang ketika ada perubahan baik pada state.nuts atau state.honey change
const [nuts, honey] = useStore(state => [state.nuts, state.honey], shallow)

// Mengambil hasil Map, komponen akan dimuat ulang ketika ada perubahan pada state.treats changes yang telah dimuat
const treats = useStore(state => Object.keys(state.treats), shallow)
```

## Mengambil dari berbagai store

Karena store dapat dibuat secara bebas, hal ini dapat dibuat menggunakan fungsi yang bisa disesuaikan dengan maksud dan tujuannya.

```jsx
const currentBear = useCredentialsStore(state => state.currentBear)
const bear = useBearStore(state => state.bears[currentBear])
```

## Mengingat selectors

Sebaiknya menggunakan useCallback untuk mengingat *selector*, hal ini untuk menghindari proses yang tidak diperlukan pada setiap *render* komponen, dan juga dapat meningkatkan pada mode *concurrent*.

```jsx
const fruit = useStore(useCallback(state => state.fruits[id], [id]))
```

Selector dapat dibuat di luar fungsi *render* untuk menghasilkan referensi tanpa menggunakan useCallback.

```jsx
const selector = state => state.berries

function Component() {
  const berries = useStore(selector)
```

## Menulis kembali state

Fungsi `set` mempunyai argumen kedua, dengan kondisi `false` pada awalnya, contoh di bawah adalah model state.

```jsx
import omit from "lodash-es/omit"

const useStore = create(set => ({
  salmon: 1,
  tuna: 2,
  deleteEverything: () => set({ }, true), // clears the entire store, actions included
  deleteTuna: () => set(state => omit(state, ['tuna']), true)
}))
```

## Menggunakan Async

Gunakan langsung fungsi `set`, zustand tidak melakukan penelurusuran apakah sebuah aksi async atau tidak.

```jsx
const useStore = create(set => ({
  fishies: {},
  fetch: async pond => {
    const response = await fetch(pond)
    set({ fishies: await response.json() })
  }
}))
```

## Membaca dari state di dalam sebuah Aksi

`set` mengizinkan fungsi update `set(state => result)`, namun masih bisa untuk akses ke state di luar menggunakan `get`.

```jsx
const useStore = create((set, get) => ({
  sound: "grunt",
  action: () => {
    const sound = get().sound
    // ...
  }
})
```

## Membaca/menulis dan melakukan sebuah tindakan untuk mengubah komponen di luar

Contoh di bawah adalah sebuah *hook* yang memiliki fungsi utilitas yang disematkan ke dalam prototypenya.

```jsx
const useStore = create(() => ({ paw: true, snout: true, fur: true }))

// Getting non-reactive fresh state
const paw = useStore.getState().paw
// Listening to all changes, fires on every change
const unsub1 = useStore.subscribe(console.log)
// Listening to selected changes, in this case when "paw" changes
const unsub2 = useStore.subscribe(console.log, state => state.paw)
// Subscribe also supports an optional equality function
const unsub3 = useStore.subscribe(console.log, state => [state.paw, state.fur], shallow)
// Subscribe also exposes the previous value
const unsub4 = useStore.subscribe((paw, previousPaw) => console.log(paw, previousPaw), state => state.paw)
// Updating state, will trigger listeners
useStore.setState({ paw: false })
// Unsubscribe listeners
unsub1()
unsub2()
unsub3()
unsub4()
// Destroying the store (removing all listeners)
useStore.destroy()

// You can of course use the hook as you always would
function Component() {
  const paw = useStore(state => state.paw)
```

## Menggunakan zustand tanpa React

Kode Zustands dapat dipanggil dan digunakan tanpa bergantung pada pustaka React, perbedaannya adalah fungsi yang dibuat tidak mengembalikan sebuah *hook*, namun utilitas *api*.

```jsx
import create from 'zustand/vanilla'

const store = create(() => ({ ... }))
const { getState, setState, subscribe, destroy } = store
```

Menggunakan store dalam bentuk vanilla dengan React:

```jsx
import create from 'zustand'
import vanillaStore from './vanillaStore'

const useStore = create(vanillaStore)
```

## Updates sementara (sering digunakan pada perubahan state)

Fungsi subscribe mengizinkan untuk mengikat suatu state tanpa memaksa memuat ulang pada suatu perubahan.
Langkah terbaik gunakan kombinasi useEffect agar otomatis melepaskan pada saat unmount komponen. Sangat [drastis](https://codesandbox.io/s/peaceful-johnson-txtws) pada performa ketika melakukan mutasi pada tampilan.

```jsx
const useStore = create(set => ({ scratches: 0, ... }))

function Component() {
  // Fetch initial state
  const scratchRef = useRef(useStore.getState().scratches)
  // Connect to the store on mount, disconnect on unmount, catch state-changes in a reference
  useEffect(() => useStore.subscribe(
    scratches => (scratchRef.current = scratches), 
    state => state.scratches
  ), [])
```

## Reducers dan melakukan perubahan pada state yang bercabang? Gunakan Immer!

Mengurangi percabangan struktur sangat melelahkan, apakah sudah mencoba [immer](https://github.com/mweststrate/immer)?

```jsx
import produce from 'immer'

const useStore = create(set => ({
  lush: { forrest: { contains: { a: "bear" } } },
  set: fn => set(produce(fn)),
}))

const set = useStore(state => state.set)
set(state => {
  state.lush.forrest.contains = null
})
```

## Middleware (potongan kode sebagai penghubung)

Menyusun store sesuai yang diinginkan

```jsx
// Log every time state is changed
const log = config => (set, get, api) => config(args => {
  console.log("  applying", args)
  set(args)
  console.log("  new state", get())
}, get, api)

// Turn the set method into an immer proxy
const immer = config => (set, get, api) => config(fn => set(produce(fn)), get, api)

const useStore = create(
  log(
    immer((set) => ({
      bees: false,
      setBees: (input) => set((state) => void (state.bees = input)),
    })),
  ),
)
```


<overview>
<summary>Cara menghubungkan middlewares</summary>

<details>


```js
import create from "zustand"
import produce from "immer"
import pipe from "ramda/es/pipe"

/* log and immer functions from previous example */
/* you can pipe as many middlewares as you want */
const createStore = pipe(log, immer, create)

const useStore = createStore(set => ({
  bears: 1,
  increasePopulation: () => set(state => ({ bears: state.bears + 1 }))
}))

export default useStore
```

For a TS example see the following [discussion](https://github.com/pmndrs/zustand/discussions/224#discussioncomment-118208)
</details>
</overview>

<overview>
<summary>Cara menggunakan immer middleware dalam bentuk TypeScript</summary>

<details>


```ts
import { State, StateCreator } from 'zustand'
import produce, { Draft } from 'immer'

const immer = <T extends State>(
  config: StateCreator<T, (fn: (draft: Draft<T>) => void) => void>
): StateCreator<T> => (set, get, api) =>
  config((fn) => set(produce(fn) as (state: T) => T), get, api)
```

</details>
</overview>

## Menyimpan middleware

Pustaka middleware dapat menyimpan data store dengan menggunakan berbagai perangkat storage.

```jsx
import create from "zustand"
import { persist } from "zustand/middleware"

export const useStore = create(persist(
  (set, get) => ({
    fish: 0,
    addAFish: () => set({ fish: get().fish + 1 })
  }),
  {
    name: "food-storage", // unique name
    storage: sessionStorage, // (optional) default is 'localStorage'
  }
))
```

## Apabila terbiasa menggunakan redux, berikut hal serupa

```jsx
const types = { increase: "INCREASE", decrease: "DECREASE" }

const reducer = (state, { type, by = 1 }) => {
  switch (type) {
    case types.increase: return { grumpiness: state.grumpiness + by }
    case types.decrease: return { grumpiness: state.grumpiness - by }
  }
}

const useStore = create(set => ({
  grumpiness: 0,
  dispatch: args => set(state => reducer(state, args)),
}))

const dispatch = useStore(state => state.dispatch)
dispatch({ type: types.increase, by: 2 })
```

Atau, gunakan langusng redux-middleware yang dimiliki zustand, cara ini langsung menghubungkan reducer utama, membuat state awal, menambahkan fungsi dispatch ke dalam state dan *api* pada vanilla, kunjungi contoh berikut [ini](https://codesandbox.io/s/amazing-kepler-swxol).

```jsx
import { redux } from 'zustand/middleware'

const useStore = create(redux(reducer, initialState))
```

## Redux devtools

```jsx
import { devtools } from 'zustand/middleware'

// Usage with a plain action store, it will log actions as "setState"
const useStore = create(devtools(store))
// Usage with a redux store, it will log full action types
const useStore = create(devtools(redux(reducer, initialState)))
```

Perangkat devtools mengambil fungsi store sebagai argumen pertamanya, dan sebagai opsi lainnya pada argumen kedua: `devtools(store, "MyStore")`, yang digunakan untuk menjalankan aksi.

## TypeScript

```tsx
type State = {
  bears: number
  increase: (by: number) => void
}

const useStore = create<State>(set => ({
  bears: 0,
  increase: (by) => set(state => ({ bears: state.bears + by })),
}))
```

Atau, gunakan `combine` dan tsc yang akan memproses setiap types.

```tsx
import { combine } from 'zustand/middleware'

const useStore = create(
  combine(
    { bears: 0 }, 
    (set) => ({ increase: (by: number) => set((state) => ({ bears: state.bears + by })) })
  ),
)
```

## Kontribusi

Dokumen ini membutuhkan pembaharuan agar menjadi lebih baik untuk dipelajari, bergabung bersama kami untuk komunikasi lebih lanjut di Discord server:

- [Pejuang Kode](https://discord.gg/n2Pm2s7)
- [Frontend Indonesia](