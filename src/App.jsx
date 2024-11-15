export default function App() {
  return (
    <div className="App">
      <Pager
        total={10} // 合計のアイテム数
        perPage={10} // 1ページに表示するアイテム数
        currentPage={1} // 現在のページ
        onChangePage={(page) => console.log(`Change page: ${page}`)} // ページ変更時のコールバック
      />
    </div>
  );
}

const Pager = ({ total, perPage, currentPage, onChangePage }) => {
  let result = {};
  try {
    result = calcPage({ total, perPage, currentPage });
  } catch {
    return null; // calcPage()がエラーを返した場合は何も表示しない
  }

  return (
    <div className="pager">
      <button
        disabled={currentPage <= 1}
        onClick={() => onChangePage(currentPage - 1)}
      >
        前のページ
      </button>
      <span>{`${result.from} - ${result.to} / ${total}`}</span>
      <button
        disabled={currentPage >= result.lastPage}
        onClick={() => onChangePage(currentPage + 1)}
      >
        次のページ
      </button>
    </div>
  );
};

// アイテム数などを渡すと、表示範囲や最終ページを計算する関数
const calcPage = ({ total, perPage, currentPage }) => {
  if (total === 0 || perPage === 0 || currentPage === 0) {
    throw new Error();
  }

  const from = (currentPage - 1) * perPage + 1;
  const to = currentPage * perPage > total ? total : currentPage * perPage;

  const lastPage = parseInt((total - 1) / perPage, 10) + 1; // この計算がどうなの？と思っているので↓
  // const lastPage = Math.ceil(total / perPage); // こちらに修正したい
  // 小数を整数にするparseIntより、切り上げのほうが計算も少なく、コードの意図もわかりやすい
  // テストがあれば、修正後も結果が変わらないことを担保できる

  if (currentPage > lastPage) {
    // errorCasesの最後のケースを考慮して、エラー判定を追加
    throw new Error();
  }

  return {
    from,
    to,
    lastPage,
  };
};

///// 以下テストのためのコード /////

// calcPage()に対するテストケースを複数用意して、意図した結果になっているか確認する
const testCases = [
  [
    { total: 95, perPage: 10, currentPage: 1 }, // 引数
    { from: 1, to: 10, lastPage: 10 }, // 想定している返り値
  ],
  [
    { total: 95, perPage: 20, currentPage: 1 },
    { from: 1, to: 20, lastPage: 5 },
  ],
  [
    { total: 95, perPage: 1, currentPage: 1 },
    { from: 1, to: 1, lastPage: 95 },
  ],
  [
    { total: 95, perPage: 10, currentPage: 10 },
    { from: 91, to: 95, lastPage: 10 },
  ],
  [
    { total: 9, perPage: 10, currentPage: 1 },
    { from: 1, to: 9, lastPage: 1 },
  ],
];

testCases.forEach((item) => {
  const result = calcPage(item[0]);
  ["from", "to", "lastPage"].forEach((key) => {
    if (result[key] !== item[1][key]) {
      console.log(
        `${JSON.stringify(item[0])} ${key} should be ${item[1][key]}, but ${
          result[key]
        }`,
      );
    }
  });
});

// エラーになるケースもテストする
const errorCases = [
  // 0を含むケース
  { total: 0, perPage: 10, currentPage: 1 },
  { total: 10, perPage: 0, currentPage: 1 },
  { total: 10, perPage: 10, currentPage: 0 },

  // 負の値を含むケース
  { total: -10, perPage: 10, currentPage: 0 },
  { total: 10, perPage: 0, currentPage: -1 },
  { total: 10, perPage: -10, currentPage: 0 },

  // 存在しないページを指定
  { total: 10, perPage: 10, currentPage: 100 },
];

for (const input of errorCases) {
  try {
    calcPage(input);
  } catch (err) { /* eslint-disable-line no-unused-vars */
    // エラーが発生するのが意図した挙動
    continue;
  }

  console.error(`Expect to throw!: ${JSON.stringify(input)}`);
}
