import React, { useContext } from 'react';
import { UserContext } from "../userProvider/UserContext";
import Member from './Member';

const Members = ({ member, deletedMembers, ownerUserId, currentUserId, list, setDeletedMembers, updateList }) => {
    const { userList } = useContext(UserContext);

    //Filtrace členů pro konkrétní list
    const membersOfThisList = userList.filter((e) => e.id === member && !deletedMembers.includes(e.id));
    
    return (
        <div>
            {membersOfThisList.map((member) => (
                <Member
                    key={member.id}
                    member={member}
                    list={list}
                    setDeletedMembers={setDeletedMembers}
                    updateList={updateList}
                    isOwner={currentUserId === ownerUserId}
                    isSelf={currentUserId === member.id}
                />
            ))}
        </div>
    );
};

export default Members;