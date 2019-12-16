import React from 'react';
import { render } from '@testing-library/react';
import App,{Todo, TodoForm, useTodos} from './App';
import {shallow, mount, configure} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({adapter: new Adapter()}); // ejecuta test sobre los componentes

describe("App", () => {
  describe("Todo", () =>{
    it('ejecuta completeTodo cuando doy click en Complete', () => {
        const completeTodo = jest.fn(); // crea Mock
        const removeTodo = jest.fn();
        const index = 5;
        const todo ={
          isComplete: true,
          text:'lala'
        };
        const wrapper = shallow(<Todo
          completeTodo = {completeTodo}
          removeTodo   = {removeTodo}
          index = {index}
          todo = {todo}
        />)
        
        wrapper
          .find('button')
          .at(0)
          .simulate('click');
        
        expect(completeTodo.mock.calls).toEqual([[5]]);
        expect(removeTodo.mock.calls).toEqual([]);
        //completeTodo.mock.calls === [];  Número de veces que se llamo la función.
    });

    it('ejecuta removeTodo cuando doy click en X', () => {
      const completeTodo = jest.fn(); // crea Mock
      const removeTodo = jest.fn();
      const index = 5;
      const todo ={
        isComplete: true,
        text:'lala'
      };
      const wrapper = shallow(<Todo
        completeTodo = {completeTodo}
        removeTodo   = {removeTodo}
        index = {index}
        todo = {todo}
      />)
      
      wrapper
        .find('button')
        .at(1)
        .simulate('click');
      
      expect(removeTodo.mock.calls).toEqual([[5]]);
      expect(completeTodo.mock.calls).toEqual([]);
    });
  });

  describe('TodoForm',() => {
    it('Llamar a addTodo cundo el formulario tiene un valor', () => {
       const addTodo = jest.fn();
       const prevent = jest.fn();
       const wrapper = shallow (<TodoForm addTodo = {addTodo}/>);

       wrapper
        .find('input')
        .simulate('change', {target: {value:"mi nuevo todo!"}});
       wrapper
        .find('form')
        .simulate('submit', {preventDefault: prevent });
        expect(addTodo.mock.calls).toEqual([['mi nuevo todo!']]);
        expect(prevent.mock.calls).toEqual([[]]);
    });
  });

  // requiere orden de ejecución y componente de ejecución
  describe("custom hook: useTodos", () => {
    it('addTodo', () => {
        const Test = (props) => { // componente de prueba
          const hook = props.hook();
          return <div {...hook}></div>;
        }

        const wrapper = shallow (<Test hook={useTodos}/>)
        let props = wrapper.find('div').props();
        props.addTodo('Texto de prueba');
        props = wrapper.find('div').props(); // obtener valores de prueba
        expect(props.todos[0]).toEqual({text: 'Texto de prueba'});
    });

    it("completeTodo", () => {
      const Test = props => { // componente de prueba
        const hook = props.hook();
        return <div {...hook}></div>;
      }

      const wrapper = shallow (<Test hook={useTodos}/>)
      let props = wrapper.find('div').props();
      props.completeTodo(0);
      props = wrapper.find('div').props(); // obtener valores de prueba
      expect(props.todos[0]).toEqual({text: "Todo 1" , isCompleted: true});
    });

    it("removeTodo", () => {
      const Test = props => { // componente de prueba
        const hook = props.hook();
        return <div {...hook}></div>;
      }

      const wrapper = shallow (<Test hook={useTodos}/>)
      let props = wrapper.find('div').props();
      props.removeTodo(0);
      props = wrapper.find('div').props(); // obtener valores de prueba
      expect(props.todos).toEqual([
        {
          text: "Todo 2",
          isCompleted: false
        },
        {
          text: "Todo 3",
          isCompleted: false
        }
      ]);
    });

    it ('App', () => {
      const wrapper = mount(<App/>)
      const prevent = jest.fn();

      wrapper
      .find('input')
      .simulate('change', {target: {value:"mi todo!"}});

      wrapper
        .find('form')
        .simulate('submit', {preventDefault: prevent });
      
      const respuesta = wrapper
      .find('.todo')
      .at(0)
      .text()
      .includes('mi todo!')

      console.log(respuesta);

      expect(respuesta).toEqual(true);
      expect(prevent.mock.calls).toEqual([[]]);
    });

  });
});

