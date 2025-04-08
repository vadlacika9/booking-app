import {Bokor} from 'next/font/google'
import { Forum } from 'next/font/google'

const bokorFont = Bokor({
  subsets: ["latin"],
  weight:"400"
})

const forumFont = Forum({
  subsets: ["latin"],
  weight:"400"
})
export default function FontTest(){
  return(
    <div>
    <div className={`m-6 ${bokorFont.className}`}>
      <h1>Bokor</h1>
      <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla non turpis elit. Etiam at consectetur sapien. Phasellus sit amet tellus eu tellus iaculis scelerisque eu et erat. Nunc orci diam, maximus eu arcu a, fermentum ultrices ligula. Donec faucibus sapien quis nisl vestibulum gravida. Sed sed purus augue. Nam rutrum pulvinar purus, non bibendum orci pulvinar id. Sed tristique ante vel nisi ullamcorper ullamcorper. Ut dignissim sed risus a lobortis. Nulla dapibus, nisl sed tristique tincidunt, velit mi ultrices tortor, in condimentum ante diam ac dui. Nulla ullamcorper velit eu elit porta lacinia. Maecenas commodo arcu ultrices ligula elementum cursus. Nunc orci dolor, auctor quis lacus quis, gravida egestas massa. Nam nec laoreet enim, in convallis urna.</div>
    </div>
    <div className={`m-6 ${forumFont.className}`}>
    <h1>Forum</h1>
      <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla non turpis elit. Etiam at consectetur sapien. Phasellus sit amet tellus eu tellus iaculis scelerisque eu et erat. Nunc orci diam, maximus eu arcu a, fermentum ultrices ligula. Donec faucibus sapien quis nisl vestibulum gravida. Sed sed purus augue. Nam rutrum pulvinar purus, non bibendum orci pulvinar id. Sed tristique ante vel nisi ullamcorper ullamcorper. Ut dignissim sed risus a lobortis. Nulla dapibus, nisl sed tristique tincidunt, velit mi ultrices tortor, in condimentum ante diam ac dui. Nulla ullamcorper velit eu elit porta lacinia. Maecenas commodo arcu ultrices ligula elementum cursus. Nunc orci dolor, auctor quis lacus quis, gravida egestas massa. Nam nec laoreet enim, in convallis urna.</div>
    </div>
    </div>
   
  )
}
