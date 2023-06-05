import './App.css'

function App() {
  // https://fontsgeek.com/fonts/itc-newtext-regular
  return (
    <div id={'content'}>
      <header id={'header'}>
          {/* Logo? */}
          <h1>Meal Dealer</h1>
      </header>
        <main id={'main'}>
            <section id={'selected-meal'}>
                <article id={'meal-contents'}>
                <div className={'meal-deal-item'}>
                    <h2>Main</h2>
                    <div className={'meal-content-square'}></div>
                </div>
                <div className={'meal-deal-item'}>
                    <h2>Snack</h2>
                    <div className={'meal-content-square'}></div>
                </div>
                <div className={'meal-deal-item'}>
                    <h2>Drink</h2>
                    <div className={'meal-content-square'}></div>
                </div>
                </article>
                <article id={'actions'}>
                    <button> share (share icon) </button>
                    <button> randomly generate (dice) </button>
                </article>
            </section>
            <section id={'meal-options'}>
                <article id={'main-options'}>
                    <h3>Mains</h3>
                    <ul className={'meal-choice-list'}>
                        <li className={'meal-choice-list-item'}>
                            <div className={'meal-main-choice meal-choice'}></div>
                        </li>
                    </ul>
                </article>
                <article id={'snack-options'}>
                    <h3>Snacks</h3>
                    <ul className={'meal-choice-list'}>
                        <li className={'meal-choice-list-item'}>
                            <div className={'meal-snacl-choice meal-choice'}></div>
                        </li>
                    </ul>
                </article>
                <article id={'drink-options'}>
                    <h3>Drinks</h3>
                    <ul className={'meal-choice-list'}>
                        <li className={'meal-choice-list-item'}>
                            <div className={'meal-drink-choice meal-choice'}></div>
                        </li>
                    </ul>
                </article>
            </section>
        </main>
        <footer>
            <p>&copy; <script>document.write(new Date().getFullYear())</script> BLKT / Pseudorizer </p>
            <a>
             {/*    Github Link */}
            </a>
        </footer>
    </div>
  )
}

export default App
