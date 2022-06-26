import Chat from '@components/Chat';
import { ChatZone, Section, StickyHeader } from '@components/ChatList/style';
import { Chats } from '@layouts/Workspace/style';
import { IDM, IChat } from '@typings/db';
import React, { useCallback, forwardRef, RefObject, MutableRefObject, VFC, useRef } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

interface Props{
  chatSections: {[key:string]: IDM[] };
  setSize: (f: (size: number) => number) => Promise<IDM[][] | undefined>
  isReachingEnd: boolean;
}
const ChatList = forwardRef<Scrollbars, Props>(({chatSections, setSize, isReachingEnd}, scrollRef )=>{

  const onScroll = useCallback((values)=>{
    if (values.scrollTop === 0 && !isReachingEnd){
      console.log("가장 위")
      setSize((prevSize)=>prevSize+1).then(()=>{
        // 스크롤 위치 유지
        const current = (scrollRef as MutableRefObject<Scrollbars>)?.current;
        if (current) {
          current.scrollTop(current.getScrollHeight() - values.scrollHeight);
         }
      })
    }
  },[scrollRef, isReachingEnd, setSize])
//   sticky 라는 기능이 있다.  ( position: sticky ) 를 사용하면 sticky박스가 scroll 박스에서 벗어나지 않는다.

  return (
    <ChatZone>
      <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
        {Object.entries(chatSections).map(([date,chats])=>{
          return (
            <Section className={`section-${date}`} key={date} >
              <StickyHeader>
                <button>{date}</button>
              </StickyHeader>
                {chats.map((chat)=>(
                  <Chat key={chat.id} data={chat} />
                ))}
            </Section>
          )
        })}
      </Scrollbars>
    </ChatZone>
  );
});

// interface Props {
//   chatSections: { [key: string]: (IDM | IChat)[] };
//   setSize: (f: (size: number) => number) => Promise<(IDM | IChat)[][] | undefined>;
//   isReachingEnd: boolean;
// }

// const ChatList = forwardRef<Scrollbars, Props>(({ chatSections, setSize, isReachingEnd }, scrollRef) => {
//   const onScroll = useCallback(
//     (values) => {
//       if (values.scrollTop === 0 && !isReachingEnd) {
//         console.log('가장 위');
//         setSize((prevSize) => prevSize + 1).then(() => {
//           // 스크롤 위치 유지
//           const current = (scrollRef as MutableRefObject<Scrollbars>)?.current;
//           if (current) {
//             current.scrollTop(current.getScrollHeight() - values.scrollHeight);
//           }
//         });
//       }
//     },
//     [scrollRef, isReachingEnd, setSize],
//   );

//   return (
//     <ChatZone>
//       <Scrollbars autoHide ref={scrollRef} onScrollFrame={onScroll}>
//         {Object.entries(chatSections).map(([date, chats]) => {
//           return (
//             <Section className={`section-${date}`} key={date}>
//               <StickyHeader>
//                 <button>{date}</button>
//               </StickyHeader>
//               {chats.map((chat) => (
//                 <Chat key={chat.id} data={chat} />
//               ))}
//             </Section>
//           );
//         })}
//       </Scrollbars>
//     </ChatZone>
//   );
// });

export default ChatList;