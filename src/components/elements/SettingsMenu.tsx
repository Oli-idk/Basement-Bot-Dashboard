import { component$ } from '@builder.io/qwik';
import { FolderOutline, FileTrayFullOutline, At, BrowsersOutline, Image, PersonAdd, PersonRemove, PeopleCircle } from 'qwik-ionicons';
import Menu, { MenuCategory, MenuItem } from '../Menu';

export default component$(({ guild, store }: any) => {
  return (
  <Menu guild={guild} store={store}>
    <MenuCategory name="General">
      <MenuItem guild={guild} href="general/#membercount">
        <FolderOutline width="25" class="fill-current" /> Member Count Channel
      </MenuItem>
      <MenuItem guild={guild} href="general/#wishlist">
        <FolderOutline width="25" class="fill-current" /> Wishlist Channel
      </MenuItem>
      <MenuItem guild={guild} href="general/#counting">
        <FolderOutline width="25" class="fill-current" /> Wishlist Channel
      </MenuItem>
    </MenuCategory>
    <MenuCategory name="Ticket System">
      <MenuItem guild={guild} href="ticket/#ticketopencategory">
        <FolderOutline width="24" class="fill-current" /> Open Category
      </MenuItem>
      <MenuItem guild={guild} href="ticket/#ticketclosedcategory">
        <FolderOutline width="24" class="fill-current" /> Closed Category
      </MenuItem>
      <MenuItem guild={guild} href="ticket/#ticketlogchannel">
        <FileTrayFullOutline width="24" class="fill-current" /> Log Channel
      </MenuItem>
      <MenuItem guild={guild} href="ticket/#supportrole">
        <At width="24" class="fill-current" /> Support Role
      </MenuItem>
      <MenuItem guild={guild} href="ticket/#ticketmsg">
        <BrowsersOutline width="24" class="fill-current" /> Ticket Embed
      </MenuItem>
    </MenuCategory>
    <MenuCategory  name="Join/Leave">
      <MenuItem guild={guild} href="joinleave/#joinmessage">
        <PersonAdd width="25" class="fill-current" /> Join Message
      </MenuItem>
      <MenuItem guild={guild} href="joinleave/#joinimage">
        <Image width="24" class="fill-current" /> Join Image
      </MenuItem>
      <MenuItem guild={guild} href="joinleave/#leavemessage">
        <PersonRemove width="25" class="fill-current" /> Leave Message
      </MenuItem>
      <MenuItem guild={guild} href="joinleave/#leaveimage">
        <Image width="24" class="fill-current" /> Leave Image
      </MenuItem>
    </MenuCategory>
    <MenuCategory  name="Levels">
      <MenuItem guild={guild} href="levels/leaderboard">
        <PeopleCircle width="25" class="fill-current" /> Leaderboard
      </MenuItem>
      <MenuItem guild={guild} href="levels/#levelrewards">
        <PeopleCircle width="25" class="fill-current" /> Level Rewards
      </MenuItem>
    </MenuCategory>
  </Menu>
  )
});