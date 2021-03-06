import {CriteriaPropertyType,InterfaceError} from '../../src/export.js';


QUnit.module( 'Class CriteriaPropertyType');
QUnit.test('test methods CriteriaPropertyType',function(assert){

    let criteria=Object.create(CriteriaPropertyType.prototype,{
        types:{
            enumerable:true,
            configurable:true,
            writable:true,
            value:['mixed'],
        },
        includes:{
            enumerable:true,
            configurable:true,
            writable:true,
            value:[]
        },
        excludes:{
            enumerable:true,
            configurable:true,
            writable:true,
            value:[]
        },
        options:{
            enumerable:true,
            configurable:true,
            writable:true,
            value:{}
        }
    });
    class A{};
    class B extends A{};


    // initOptions
    {
        let options={entryPoints:['test']};
        criteria.initOptions(options);
        let match=criteria.options!==options
                    &&options.entryPoints[0]==='test';
        assert.ok(match,'initOptions');

    }
    // initTypes
    {
        let types=['mixed','number',A,null,undefined];
        criteria.initTypes(types);
        assert.deepEqual(criteria.types,['mixed'],'initTypes');
        types=['number',A,null,undefined];
        criteria.initTypes(types);
        let match=[
            'number',
            A,
            'null',
            'undefined'
        ];
        assert.ok(criteria.types!==types,'initTypes 2');
        assert.deepEqual(criteria.types,match,'initTypes 3');

    }

    // instanceOf
    {
        class C{}; //  вдобавок тесты по интерфейсам как будет готов метод.
        let match=criteria.instanceOf(A,A)&&criteria.instanceOf(new A,A)&&criteria.instanceOf(B,A)&&criteria.instanceOf(new B,A)
            &&!criteria.instanceOf(C,A) &&!criteria.instanceOf(new C,A) && !criteria.instanceOf(10,A);
        assert.ok(match,'instanceOf');
    }

    // instanceOfInterface

    {

    }

    // validateType

    {
        criteria.validateType(1);
        criteria.validateType(A);
        criteria.validateType(new A);
        criteria.validateType(B);
        criteria.validateType(new B);
        criteria.validateType(null);
        criteria.validateType(undefined);
        assert.ok(true,'validateType');

        assert.throws(function(){
            criteria.validateType(new class C{});
        },function(e){
            return e instanceof InterfaceError;
        },'throw validateType');

        assert.throws(function(){
            criteria.validateType(class C{});
        },function(e){
            return e instanceof InterfaceError;
        },'throw validateType 2');

        assert.throws(function(){
            criteria.validateType('1');
        },function(e){
            return e instanceof InterfaceError;
        },'throw validateType 3');
    }

    // initIncludes

    {
        criteria.initIncludes([10,null,undefined,new A,new B,A,B]);
        assert.ok(true,'initIncludes');
        assert.throws(function(){
            criteria.initIncludes(['11']);
        },function(e){
            return e instanceof InterfaceError;
        },'throw initIncludes');
        assert.throws(function(){
            criteria.initIncludes([10, class C{}]);
        },function(e){
            return e instanceof InterfaceError;
        },'throw initIncludes');
        criteria.initIncludes([10,null,undefined,A]);
    }
    // validateInIncludes

    {
        criteria.validateInIncludes(10);
        criteria.validateInIncludes(null);
        criteria.validateInIncludes(undefined);
        criteria.validateInIncludes(new A);
        criteria.validateInIncludes(A);
        criteria.validateInIncludes(new B);
        criteria.validateInIncludes(B);
        assert.ok(true,'validateInIncludes');
        assert.throws(function(){
            criteria.validateInIncludes(11);
        },function(e){
            return e instanceof InterfaceError;
        },'throw validateInIncludes');
    }
    // validateInValues

    {
        criteria.validateInValues(10,criteria.includes);
        criteria.validateInValues(null,criteria.includes);
        criteria.validateInValues(undefined,criteria.includes);
        criteria.validateInValues(new A,criteria.includes);
        criteria.validateInValues(A,criteria.includes);
        criteria.validateInValues(new B,criteria.includes);
        criteria.validateInValues(B,criteria.includes);
        assert.ok(true,'validateInValues');
        assert.throws(function(){
            criteria.validateInValues(11,criteria.includes);
        },function(e){
            return e instanceof InterfaceError;
        },'throw validateInValues');
    }

    // initExcludes

    {
        criteria.initExcludes([10,null,undefined,new A,new B,A,B]);
        assert.ok(true,'initExcludes');
        assert.throws(function(){
            criteria.initExcludes(['11']);
        },function(e){
            return e instanceof InterfaceError;
        },'throw initExcludes');
        assert.throws(function(){
            criteria.initExcludes([10, class C{}]);
        },function(e){
            return e instanceof InterfaceError;
        },'throw initExcludes 2');
        criteria.initExcludes([11,B]);
    }

    // validateExcludes

    {
        criteria.validateInExcludes(12);
        criteria.validateInExcludes(null);
        criteria.validateInExcludes(undefined);
        criteria.validateInExcludes(new A);
        criteria.validateInExcludes(A);
        assert.ok(true,'validateInExcludes');
        assert.throws(function(){
            criteria.validateInExcludes(11);
        },function(e){
            return e instanceof InterfaceError;
        },'throw validateInExcludes');
        assert.throws(function(){
            criteria.validateInExcludes(B);
        },function(e){
            return e instanceof InterfaceError;
        },'throw validateInExcludes 2');
        assert.throws(function(){
            criteria.validateInExcludes(new B);
        },function(e){
            return e instanceof InterfaceError;
        },'throw validateInExcludes 3');
    }
    // validate
    {
        class C extends A{};
        class D extends B{};
        // initIncludes [10,null,undefined,A]
        criteria.initExcludes([10, B]);
        let match= criteria.validate(C)
        && criteria.validate(new C)
        && criteria.validate(null)
        && criteria.validate(undefined);
        assert.ok(match,'validate');
        assert.throws(function(){
            criteria.validate(D);
        },function(e){
            return e instanceof InterfaceError;
        },'throws validate');
        assert.throws(function(){
            criteria.validate(new D);
        },function(e){
            return e instanceof InterfaceError;
        },'throws validate 2');
        assert.throws(function(){
            criteria.validate(10);
        },function(e){
            return e instanceof InterfaceError;
        },'throws validate 3');
    }

    // compare
    {
        {
            let criteria2=new CriteriaPropertyType({

                types:[A],
                includes:[A],
                excludes:[B]
            });
            criteria.compare(criteria2);
            assert.ok(true,'compare');
        }
        {
            let criteria2=new CriteriaPropertyType({
                types:[class C{}],
            });
            assert.throws(function(){
                criteria.compare(criteria2);
            },function(e){
                return e instanceof InterfaceError;
            },'throw compare [check types]');
        }
        {
            criteria.initIncludes([B]);
            class C extends A{}
            let criteria2=new CriteriaPropertyType({
                types:[A],
                includes:[C],
                excludes:[B],
            });
            assert.throws(function(){
                criteria.compare(criteria2);
            },function(e){
                return e instanceof InterfaceError;
            },'throw compare [check includes]');
        }
        {
            class C extends A{}
            let criteria2=new CriteriaPropertyType({
                types:[A],
                includes:[B],
                excludes:[C],
            });

            assert.throws(function(){
                criteria.compare(criteria2);
            },function(e){
                return e instanceof InterfaceError;
            },'throw compare [check excludes]');
        }
    }

    // expand
    {
        class Z{}
        let criteria2=new CriteriaPropertyType({
            types:[Z,'string','number'],
            includes:[1000],
            excludes:[1001],
        });

        criteria.expand(criteria2);
        let match={
            types:[
                'number',
                A,
                'null',
                'undefined',
                Z,
                'string'
            ],
            excludes:[
                10,B,1001
            ],
            includes:[
                B,1000
            ],
            options: criteria.options
        };
        assert.propEqual(
            criteria,
            match,
            'expand'
        );
    }
});