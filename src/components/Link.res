let getHref: ReactEvent.Mouse.t => string = %raw(`e => e.currentTarget.href || ''`)
let getOrigin: unit => string = %raw(`() => window.location.origin`)

@react.component
let make = (
  ~children: React.element,
  ~to: string,
  ~onClick: option<ReactEvent.Mouse.t => unit>=?,
) => {
  let handleClick = e => {
    let href = getHref(e)

    switch Js.String2.startsWith(href, getOrigin()) {
    | true => {
        ReactEvent.Mouse.preventDefault(e)

        RescriptReactRouter.push(href)
      }

    | false => ()
    }

    switch onClick {
    | Some(func) => func(e)
    | None => ()
    }
  }

  <a onClick={handleClick} href={to}> {children} </a>
}
