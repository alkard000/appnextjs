import styled from '@emotion/styled';

export const Formulario = styled.form`
    width:50%;
    min-width:300px;
    margin:5rem auto 5rem auto;
    background-color:#fff;
    padding:4rem;
    border-radius:15px;
    font-family:'PT Sans', sans-serif;


`;

export const Campo = styled.div`
    margin-bottom:2rem;
    display:flex;
    align-items:center;
    transition:all 0.3s ease;
    border:#a1a1a1 1px solid;
    padding:1rem;
    border-radius:15px;
    min-width:300px;

    /* @media (max-width:600px){
        width:50%;
    } */

    label{
        flex:0 0 150px;
        font-size:1.8rem;
    }

    @media (max-width:600px){
        label{
            font-size:1rem!important;
            flex:0 0 60px;
        }
    }

    input, 
    textarea{
        flex:1;
        padding:1rem;
        font-size:2rem;
    }

    @media (max-width:600px){
        input,
        textarea{
            font-size:1rem!important;
        }
    }

    @media (max-width:600px){
        input  #imagen{
            font-size:.5rem!important;
        }
    }

    textarea{
        height:300px;
    }

    @media (max-width:600px){
        textarea{
            height:150px!important;
        }
    }
`;

export const InputSubmit = styled.input`

    background-color:var(--naranja);
    width:100%;
    padding:1.5rem;
    text-align:center;
    color:#fff;
    font-size:1.8rem;
    text-transform:uppercase;
    border:none;
    font-family:'PT Sans', sans-serif;
    font-weight:700;

    &:hover{
        cursor:pointer;
    }
`;

export const Error = styled.p`
    background-color:red;
    padding:1rem;
    font-family:'PT Sans', sans-serif;
    font-weight:700;
    font-size:1.4rem;
    color:#fff;
    text-align:center;
    text-transform:uppercase;
    margin:2rem 0;
    transition:all 0.3s ease;
`;