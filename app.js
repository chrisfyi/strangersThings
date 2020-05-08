const app = $('#app');

const BASE_URL = 'https://strangers-things.herokuapp.com/api/posts'



const TOKEN_KEY = '';
// USER_TOKEN

const USERNAME = '';
// chris_test
const PASSWORD = '';
// test-password
let token;
let state= {
    postItems: []
}


const postsDiv= $('<div>')

//when adding new forms call render
const render = () => {
    const root = $('#app');

    
    root.append(postsDiv)
    postsDiv.empty()
    postsDiv.append(updateMainPosts(state.postItems))
}

const fetchPosts = async ()=> {
    const url = BASE_URL;

    try {
        const response = await fetch(url);
        const {data} = await response.json();
        // render function here for appending to #app id
        // console.log(data)
        state.postItems= data.posts

        render()
        return data;
    } catch (error){
        console.error('Unable to receive posts!', error )
    }
}

fetchPosts().then(obj => console.log(obj))


function renderMainPosts(postItem) {
     const { title, username, description, price, willDeliver } = postItem;
        // console.log(postItem)
     return $(`<main id='posts'> <h3>${title ? title : ''}</h3>
     <h4>${username ? username : ''}</h4> 
     <p> ${description ? description :''}</p>
      <h5> Price: ${price ? price : ''}</h5> 
      <h5> Delivery : ${willDeliver ? willDeliver : 'No'}</h5> 
      </main>`).data('postItem' , postItem);

      
}

function updateMainPosts(postItems) {
    // console.log(postItems)
    
    // postsDiv.empty();
    
    return postItems.map( function(postItem) {
       return renderMainPosts(postItem)
    });
}

const signUp = async () => {
     
    try {    
        const response = await fetch('https://strangers-things.herokuapp.com/api/users/register' ,{
        
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            user: {
                username: USERNAME ,
                password: PASSWORD
            },
        })
    })
        const json = await response.json();
        console.log('Sign up response: ', json);
        return json;
    
        
    } catch (error) {
    console.error('Failed to Sign Up!');
    throw error;
    }
}

$('#signUp').on('click' , function() {
    // signUp();
    event.preventDefault;
    
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token){
    $('.sign-up-modal').addClass('open')

    console.log('successful sign up!')
    }else {
        return console.error('User already exists!');
    }

    
})

$('.sign-up-modal .submitNewUser').on('click' , function(){
    signUp()
})

$('.sign-up-modal .cancelNewUser').on('click', function(){
    $('.sign-up-modal').removeClass('open')
})


const userLogin = async () => {
    try {
        const response = await fetch('https://strangers-things.herokuapp.com/api/users/login' , {
            
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify({
            user: {
                username: USERNAME, 
                password: PASSWORD
            },
        })
    }) 
        const json = await response.json();
        console.log('Login response: ', json);
        return json; 

    }catch (error) {
        console.error('Failed to Login! ');
        throw error
    }
}


const storeToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token)
}



const bootstrapAPI = async () => {
    const storageToken = localStorage.getItem(TOKEN_KEY);
    if (storageToken) {
      console.log('Found previous login!', storageToken);
      token = storageToken;
    } else {
      const userResponse = await signUp();
  
      if (userResponse.success) {
        const responseToken = userResponse.data.token;
        console.log('Successful login!', responseToken);
        storeToken(token);
        token = responseToken;
      } else {
        console.warn('Failed to sign up!');
        const response = await userLogin();
        const responseToken = response.data.token;
        storeToken(responseToken);
        token = responseToken;
      }
    }
    return token;
    }

  const runApp = async () => {
    const token = await bootstrapAPI();
  
    const response = await fetch('https://strangers-things.herokuapp.com/api/test/me', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  
    const json = await response.json();
  
    console.log('App Started: ', json);
  };
  

$('#login').on('click' , function() {
    // runApp();


    })

const createUserPost = () => {
        
    let newTitle = $('#newPostTitle').val();
    let newDescription = $('#newPostDescription').val();
    let newPrice = $('#newPostPrice').val();
    let newDelivery = $('#newPostDelivery').val();

    const newCreatedPost = {
        title:newTitle,
        description:newDescription,
        price:newPrice,
        delivery:newDelivery
    };

    return newCreatedPost
    // $(`<div id='userCreatedPosts'> <h3>${title ? title : ''}</h3>
    // <h4>${username ? username : ''}</h4> 
    // <p> ${description ? description :''}</p>
    //  <h5> Price: ${price ? price : ''}</h5> 
    //  <h5> Delivery : ${willDeliver ? willDeliver : 'No'}</h5> 
    //  </main>`)
}

$('#createNewPost').on('click' , function() {
    //Check if they have token
    const token = localStorage.getItem(TOKEN_KEY)
    if (token){ 
        $('.modal').addClass('open')
         //If they do call createUserPost
        createUserPost();
        
    //If they dont just return
     }else {
         return console.error('Must be logged in!') ;
     }
    //local storage get item token key
   
    // If user token exists render for if they dont, dont
})

$('.modal .createPost').on('click' , function(){
    event.preventDefault();
    
    // const oldPosts= updateMainPosts() ;
    // const root = $('#app');
    const newPost = createUserPost(posts);
    console.log(newPost)
    
    state.postItems.unshift(newPost)
    $('.modal').removeClass('open')

    render()

})

$('.modal .cancelPost').on('click' , function(){
    $('.modal').removeClass('open')
})

//