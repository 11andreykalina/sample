// Ждем когда вся структура HTML-страницы загрузится
document.addEventListener('DOMContentLoaded', function() {
    // Находим поле ввода калькулятора по его ID
    const display = document.getElementById('display');
    
    // Переменная для хранения всего уравнения (например: "5 + 3")
    let equation = "";
    
    // Переменная для текущего набираемого числа (например: "12.5")
    let currentNumber = "";
    
    // Переменная для хранения последней операции (не используется в текущей логике)
    let lastOperation = null;

    // Находим ВСЕ кнопки калькулятора с классом 'btn'
    const buttons = document.querySelectorAll('.btn');

    // Для КАЖДОЙ кнопки добавляем обработчик клика
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Получаем текст на кнопке (цифра или символ)
            const value = this.textContent;
            
            // Определяем тип кнопки по её классам:
            const type = this.classList.contains('operator') ? 'operator' : // + - * /
                      this.classList.contains('symbol') ? 'symbol' :       // .
                      this.classList.contains('equal') ? 'equal' :         // =
                      this.classList.contains('clear') ? 'clear' :         // C
                      'number'; // Все остальные - цифры

            // В зависимости от типа кнопки вызываем соответствующую функцию
            switch(type) {
                case 'number':   // Если это цифра
                    handleNumber(value);
                    break;
                case 'operator': // Если это оператор + - * /
                    handleOperator(value);
                    break;
                case 'symbol':   // Если это точка
                    handleSymbol(value);
                    break;
                case 'equal':    // Если это кнопка =
                    calculateResult();
                    break;
                case 'clear':    // Если это кнопка очистки
                    clearCalculator();
                    break;
            }
        });
    });

    // Обработчик для цифровых кнопок (0-9)
    function handleNumber(num) {
        // Защита от нескольких нулей в начале числа
        if (currentNumber === "0" && num === "0") return;
        
        // Добавляем цифру к текущему числу
        currentNumber += num;
        
        // Показываем текущее число на дисплее
        display.value = currentNumber;
    }

    // Обработчик для операторов + - * /
    function handleOperator(op) {
        // Если уравнение пустое (первая операция)
        if (equation === "") {
            // Начинаем уравнение с текущего числа
            equation = currentNumber;
        } 
        // Если в currentNumber что-то есть (пользователь ввел второе число)
        else if (currentNumber !== "") {
            // Вычисляем промежуточный результат
            calculateResult();
        }
        
        // Добавляем оператор в уравнение (с пробелами для читаемости)
        equation += ` ${op} `;
        
        // Показываем всё уравнение на дисплее
        display.value = equation;
        
        // Сбрасываем текущее число для ввода следующего
        currentNumber = "";
        
        // Запоминаем последнюю операцию (в текущей логике не используется)
        lastOperation = op;
    }

    // Обработчик для десятичной точки
    function handleSymbol(sym) {
        // Проверяем что это точка и что в текущем числе ещё нет точки
        if (sym === '.' && !currentNumber.includes('.')) {
            // Если число пустое, добавляем "0." иначе просто точку
            currentNumber += currentNumber === "" ? "0." : ".";
            
            // Обновляем дисплей
            display.value = currentNumber;
        }
    }

    // Функция вычисления результата
    function calculateResult() {
        // Если уравнение или текущее число пустые - выходим
        if (equation === "" || currentNumber === "") return;
        
        // Собираем полное выражение (например: "5 + 3")
        const expression = equation + currentNumber;
        
        try {
            // Заменяем 'х' на '*' (если используется русская буква)
            // Вычисляем результат с помощью eval (встроенная функция JS)
            const result = eval(expression.replace(/х/g, '*'));
            
            // Показываем результат на дисплее
            display.value = result;
            
            // Сохраняем результат как новое уравнение
            equation = result.toString();
            
            // Сбрасываем текущее число
            currentNumber = "";
        } catch (e) {
            // Если произошла ошибка (например, синтаксическая)
            display.value = "Error";
            
            // Сбрасываем всё
            equation = "";
            currentNumber = "";
        }
    }

    // Функция сброса калькулятора
    function clearCalculator() {
        equation = "";
        currentNumber = "";
        display.value = "0"; // Показываем "0" на дисплее
    }

    // Инициализация калькулятора при загрузке
    clearCalculator();
});