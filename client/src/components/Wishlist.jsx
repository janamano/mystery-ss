import React, { useCallback, useEffect, useState } from 'react';
import { Button, Form, Icon, Item, Segment } from 'semantic-ui-react';
import WishlistItem from './WishlistItem';
import Modal from 'react-bootstrap/Modal';
import { REMOTE } from '../endpoints';

export default function Wishlist(props) {

    const [open, setOpen] = useState(false);
    const [itemNameInput, setItemNameInput] = useState('');
    const [itemLinkInput, setItemLinkInput] = useState('');
    const [message, setMessage] = useState('')
    const [wishes, setWishes] = useState([]);

    useEffect(() => {
        const fetchWishes = async () => {
            await fetch(REMOTE + "/api/getWishes?username=" + props.username, {
                method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*"
                }
            })
            .then(res => {
                console.log('res', res);
                return res.json()})
            .then(res => {
                if (res.status == 'error') {
                    setMessage(res.message)
                } else {
                    console.log('jana ->', res.data)
                    if (res.data.length > 0) {
                        console.log(JSON.stringify(res.data));
                        setWishes(res.data.map((wish) => {
                            return {
                                wishName: wish.wishName,
                                wishLink: wish.wishLink,
                                wishId: wish._id
                            }
                        }))
                    }
                }
            })
            .catch(err => console.log(err))
        }
        fetchWishes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const createLink = useCallback((itemName) => {
        var wishNameAsQueryParam = itemName.split(' ').join('+')
        return 'https://www.amazon.ca/s?k=' + wishNameAsQueryParam;
    }, [])

    const handleWish = useCallback(async () => {
        if (itemNameInput.length == 0) {
            setMessage("Item Name required!")
        } else {
            let wishLink = itemLinkInput.length > 0 ? itemLinkInput : createLink(itemNameInput)
            await fetch(REMOTE + "/api/createWish", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: props.username,
                    wishName: itemNameInput,
                    wishLink:  wishLink
                }),
            })
            .then(res => res.json())
            .then(res => {
                console.log(res)
                if (res.status == 'error') {
                    setMessage(res.msg)
                } else {
                    setWishes([...wishes, {
                        wishName: itemNameInput,
                        wishLink: wishLink,
                        wishId: res.data._id}])
                    setOpen(false) 
                }
            })
            .catch(err => console.log(err))
            // setWishes([...wishes, {
            //     wishName: itemNameInput,
            //     wishLink: wishLink}])
            // setOpen(false)
        }

    }, [createLink, itemLinkInput, itemNameInput, props.username, wishes])

    const handleDelete = useCallback((wishId) => {
        fetch(REMOTE + "/api/deleteWish", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                wishId: wishId
            }),
          })
          .then(res => res.json())
          .then(res => {
            if (res.status === 'error') {
                console.log('error, cannot delete')
            } else {
                let filterFunction = function(wish) {
                    if (wish.wishId == this) {
                        return true;
                    }
                }
                var index = wishes.findIndex(filterFunction, wishId)
                wishes.splice(index, 1);
                setWishes([...wishes]);

            }
          })
          .catch(err => console.log(err))
    }, [wishes])

    return (
    <Segment>
        <Button primary animated onClick={() => {
            setOpen(true);
            setItemNameInput('');
            setItemLinkInput('');}}>
            <Button.Content visible><Icon name='hand point right' />Add an Item</Button.Content>
            <Button.Content hidden><Icon name='tag' /><Icon name='tag' /><Icon name='tag' /></Button.Content>
        </Button>

        <Modal show={open} onHide={() => setOpen(false)}>
            <Modal.Header closeButton>
                <Modal.Title>                
                    <Icon name='heart' />
                    Add Item to Wishlist
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Input label="Enter Item name" onChange={(event) => {
                            setItemNameInput(event.target.value)
                        }}  value={itemNameInput} />
                    <Form.Input label='Enter Link (Optional)' onChange={(event) => {
                            setItemLinkInput(event.target.value)
                        }} value={itemLinkInput}/>         
                </Form>
            </Modal.Body>
            <Modal.Footer>
                {message != null && message.length != 0 && message}
                <Button.Group>
                    <Button color='red' onClick={() => setOpen(false)}>
                        <Icon name='remove' /> Actually, Nevermind
                    </Button>
                    <Button.Or  />
                    <Button color='green' onClick={() => {
                        handleWish();
                    }}>
                        <Icon name='checkmark' /> Add
                    </Button>
                </Button.Group>
            </Modal.Footer>
        </Modal>
        <Item.Group divided>
            {wishes.map((wishItem) => {
                return <WishlistItem 
                    deleteWish={() => { handleDelete(wishItem.wishId)}}

                    itemName={wishItem.wishName}
                    itemLink={wishItem.wishLink}
                    showControls={true}/>
            })}
        </Item.Group>
    </Segment>)
}