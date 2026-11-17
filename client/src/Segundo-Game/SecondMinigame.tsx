import React from 'react';
import { MINIGAME_2_QUESTIONS, Option } from './MiniData-2';
import LoadingScreen from '../LogIn/LoadingScreen';
import ExitConfirmationPopup from './ExitConfirmationPopup';
import CompletionMessage from './CompletionMessage';
import OptionButton from './OptionButton';
import { useMinigameLogic } from './useMinigameLogic';
import { MINIGAME_2_SUPPORT } from './MiniData-2';
import {
    AssistToolbar,
    CheckAnswerButton,
    EsText,
    HintBox,
    HowToPlayModal,
    useAnswerSelection,
    useHowToPlay,
    useSpanishSupport,
} from '../components/minigame/MinigameAssist';
import { HOW_TO_PLAY } from './howToPlay';
import {
    KAWAI_COLORS,
    KAWAI_FONTS,
    KAWAI_TEXTURES,
    MINIGAME_BACKGROUND,
    KAWAI_STYLES
} from './minigame-styles';

interface SecondMinigameProps {
    userName: string;
}

const SecondMinigame: React.FC<SecondMinigameProps> = ({ userName }) => {
    const {
        showIntro,
        setShowIntro,
        isAnswered,
        feedback,
        showStory,
        currentDialogIndex,
        attempts,
        selectedOptionId,
        hoveredOptionId,
        setHoveredOptionId,
        isCorrectAnswer,
        showExitConfirmation,
        showCompletionMessage,
        currentQuestionIndex,
        currentQuestion,
        allQuestionsCompleted,
        progress,
        handleAnswer,
        handleExitClick,
        handleConfirmExit,
        handleCancelExit,
        handleNext,
        handleBackToMap,
        getCurrentIntroText,
        getButtonText,
    } = useMinigameLogic(userName);

    // Apoyos de usabilidad: español (#07), pistas (#08), confirmar respuesta (#14), cómo jugar (#18)
    const support = currentQuestion ? MINIGAME_2_SUPPORT[currentQuestion.id] : undefined;
    const [showSpanish, toggleSpanish] = useSpanishSupport();
    const { showHowTo, openHowTo, closeHowTo } = useHowToPlay('verb-workshop', !showIntro && !allQuestionsCompleted && !showCompletionMessage);
    const { pendingId, setPendingId, pendingOption, hintsUsed, takeHint, eliminatedId } = useAnswerSelection(
        currentQuestion?.id,
        currentQuestion?.options ?? [],
        isAnswered,
    );
    const fillEs = (text: string) => text.replace(/{text}/g, currentQuestion?.options.find((o) => o.id === selectedOptionId)?.text ?? '').replace(/{user}/g, userName);
    const introEs = support
        ? (Array.isArray(support.es.introGreeting) ? support.es.introGreeting[currentDialogIndex] ?? '' : support.es.introGreeting)
        : '';
    const feedbackEs = support
        ? fillEs(isCorrectAnswer ? support.es.correctFeedback : attempts < 2 ? support.es.wrongAttempt1 : support.es.wrongAttempt2)
        : '';
    const isQuestionPhase = !showStory && !isAnswered;

    if (!currentQuestion) return null;

    const { sentence, options, rules, dialogue } = currentQuestion;

    const isIntroArray = Array.isArray(dialogue.introGreeting);
    const totalDialogs = isIntroArray ? dialogue.introGreeting.length : 1;
    const isLastDialog = currentDialogIndex >= totalDialogs - 1;

    const baseStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw', height: '100vh',
        zIndex: 10,
        overflow: 'hidden',
        backgroundImage: `url(${MINIGAME_BACKGROUND}), ${KAWAI_TEXTURES.texturePaper}`,
        backgroundSize: 'cover, auto',
        backgroundPosition: 'center, center',
        backgroundBlendMode: 'overlay',
        fontFamily: KAWAI_FONTS.comfortaa,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        color: KAWAI_COLORS.textDark,
    };

    const dialogBoxStyle: React.CSSProperties = {
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '680px',
        minHeight: '70px',
        padding: '15px 25px',
        backgroundColor: 'rgba(247, 240, 230, 0.8)',
        backgroundImage: KAWAI_TEXTURES.texturePaper,
        borderRadius: '20px',
        boxShadow: `8px 8px 0px ${KAWAI_COLORS.panelBorder}`,
        border: `6px solid ${KAWAI_COLORS.panelBorder}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        textAlign: 'center',
        fontSize: '1.05rem',
        zIndex: 15,
    };

    const nextButtonStyle: React.CSSProperties = {
        alignSelf: 'flex-end',
        marginTop: '10px',
        padding: '10px 30px',
        fontFamily: KAWAI_FONTS.mali,
        backgroundColor: KAWAI_COLORS.accentGreen,
        color: KAWAI_COLORS.textDark,
        border: `4px solid ${KAWAI_COLORS.panelBorder}`,
        borderRadius: '20px',
        cursor: 'pointer',
        boxShadow: `5px 5px 0px ${KAWAI_COLORS.panelBorder}`,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        transition: 'all 0.2s ease-in-out',
    };

    const logoutButtonStyle: React.CSSProperties = {
        position: 'absolute',
        top: '20px',
        left: '20px',
        padding: '10px 20px',
        fontFamily: KAWAI_FONTS.mali,
        backgroundColor: KAWAI_COLORS.accentPink,
        color: KAWAI_COLORS.textDark,
        border: `4px solid ${KAWAI_COLORS.panelBorder}`,
        borderRadius: '20px',
        cursor: 'pointer',
        boxShadow: `5px 5px 0px ${KAWAI_COLORS.panelBorder}`,
        fontSize: '1rem',
        fontWeight: 'bold',
        zIndex: 20,
        transition: 'all 0.2s ease-in-out',
    };

    const optionsContainerStyle: React.CSSProperties = {
        position: 'absolute',
        top: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '20px',
        width: 'fit-content',
        maxWidth: '300px',
        zIndex: 12,
        justifyContent: 'center',
    };

    const buttonText = getButtonText();

    const introText = (
        <>
            <h3 style={KAWAI_STYLES.header}>{dialogue.introTitle}</h3>
            <EsText show={showSpanish}>{support?.es.introTitle}</EsText>
            <p style={{ color: KAWAI_COLORS.textDark, fontSize: '1.1rem', lineHeight: 1.45, margin: '6px 0 0' }}>
                {getCurrentIntroText()}
            </p>
            <EsText show={showSpanish}>{fillEs(introEs)}</EsText>
            {isLastDialog && (
                <div style={{ marginTop: '10px', fontSize: '1.05rem', color: KAWAI_COLORS.textDark }}>
                    <p style={{ margin: 0 }}><b>Rules:</b> {rules}</p>
                    <EsText show={showSpanish}>Reglas: {support?.es.rules}</EsText>
                    <p style={{ margin: '4px 0 0' }}><b>Bonus:</b> You have 2 chances to guess.</p>
                    <EsText show={showSpanish}>Tienes 2 oportunidades para responder.</EsText>
                </div>
            )}
            <p style={{ marginTop: '8px', fontSize: '0.95rem', color: KAWAI_COLORS.textDark }}>
                Press <b>{buttonText.replace(/\*\*/g, '')}</b> to continue.
                {showSpanish && <span className="tt-mg-es"> Presiona el botón para continuar.</span>}
            </p>
        </>
    );

    const questionText = (
        <>
            <p style={KAWAI_STYLES.instruction}>
                {dialogue.instruction}
            </p>
            <EsText show={showSpanish}>{support?.es.instruction}</EsText>
            <h3 style={{ margin: 0, color: KAWAI_COLORS.textDark, textAlign: 'center' }}>
                {dialogue.questionHeader}
                <span style={KAWAI_STYLES.word}>
                    {sentence.replace('{gap}', '____')}
                </span>
            </h3>
            <EsText show={showSpanish}>{support?.es.questionHeader}<b>{sentence.replace('{gap}', '____')}</b></EsText>
            <p style={{ marginTop: '5px', fontSize: '0.95rem', color: KAWAI_COLORS.textDark }}>
                Attempt {attempts + 1} of 2{showSpanish ? ` · Intento ${attempts + 1} de 2` : ''}
            </p>
            <HintBox hints={support?.hints ?? []} used={hintsUsed} showSpanish={showSpanish} />
        </>
    );

    if (showIntro && !allQuestionsCompleted) {
        return <LoadingScreen onAnimationEnd={() => setShowIntro(false)} />;
    }

    if (showCompletionMessage || allQuestionsCompleted) {
        console.log('Pantalla de completado - Progreso:', progress);

        return (
            <CompletionMessage
                totalCompleted={progress.totalCompleted}
                totalQuestions={MINIGAME_2_QUESTIONS.length}
                allQuestionsCompleted={allQuestionsCompleted}
                showCompletionMessage={showCompletionMessage}
                onBackToMap={handleBackToMap}
            />
        );
    }

    return (
        <>
            <div style={{
                ...baseStyle,
                pointerEvents: showExitConfirmation ? 'none' : 'auto',
            }}>

                <button
                    onClick={handleExitClick}
                    disabled={showExitConfirmation}
                    style={logoutButtonStyle}
                >
                    Return to Map
                </button>

                <div style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    padding: '10px 15px',
                    backgroundColor: KAWAI_COLORS.panelLight,
                    border: `3px solid ${KAWAI_COLORS.panelBorder}`,
                    borderRadius: '15px',
                    fontFamily: KAWAI_FONTS.mali,
                    fontSize: '1.05rem',
                    zIndex: 20,
                }}>
                    Question {currentQuestionIndex + 1} of {MINIGAME_2_QUESTIONS.length}
                </div>

                <AssistToolbar
                    showSpanish={showSpanish}
                    onToggleSpanish={toggleSpanish}
                    onHowTo={openHowTo}
                    hintsUsed={hintsUsed}
                    hintsTotal={support?.hints.length ?? 0}
                    onHint={takeHint}
                    canHint={isQuestionPhase && !showExitConfirmation}
                />

                {!showStory && (
                    <div style={optionsContainerStyle}>
                        {options.map((option: Option) => (
                            <OptionButton
                                key={option.id}
                                option={option}
                                isSelected={selectedOptionId === option.id}
                                isHovered={hoveredOptionId === option.id}
                                isAnswered={isAnswered}
                                isCorrectAnswer={isCorrectAnswer}
                                showExitConfirmation={showExitConfirmation}
                                onAnswer={(_isCorrect: boolean, id: number) => setPendingId(id)}
                                isPending={pendingId === option.id}
                                isEliminated={eliminatedId === option.id}
                                onHover={setHoveredOptionId}
                            />
                        ))}
                    </div>
                )}

                <div style={dialogBoxStyle}>
                    <div>
                        {showStory ? introText : (isAnswered ?
                            <div>
                                <p style={{ ...(isCorrectAnswer ? KAWAI_STYLES.feedbackCorrect : KAWAI_STYLES.feedbackIncorrect), fontSize: '1.1rem' }}>
                                    {feedback}
                                </p>
                                <EsText show={showSpanish}>{feedbackEs}</EsText>
                            </div>
                            : questionText)}
                    </div>

                    {isQuestionPhase ? (
                        <CheckAnswerButton
                            disabled={!pendingOption || showExitConfirmation}
                            onCheck={() => pendingOption && handleAnswer(pendingOption.isCorrect, pendingOption.id)}
                            style={nextButtonStyle}
                            showSpanish={showSpanish}
                        />
                    ) : (
                        <button
                            onClick={handleNext}
                            disabled={(!showStory && !isAnswered && attempts < 2) || showExitConfirmation}
                            style={{
                                ...nextButtonStyle,
                                backgroundColor: ((!showStory && !isAnswered && attempts < 2) || showExitConfirmation) 
                                    ? KAWAI_COLORS.bgMedium 
                                    : KAWAI_COLORS.accentGreen,
                                cursor: ((!showStory && !isAnswered && attempts < 2) || showExitConfirmation) 
                                    ? 'default' 
                                    : 'pointer',
                            }}
                        >
                            {buttonText.replace(/\*\*/g, '')}
                        </button>
                    )}
                </div>
            </div>

            {showHowTo && (
                <HowToPlayModal {...HOW_TO_PLAY} onClose={closeHowTo} />
            )}

            {showExitConfirmation && (
                <ExitConfirmationPopup
                    onConfirm={handleConfirmExit}
                    onCancel={handleCancelExit}
                />
            )}
        </>
    );
};

export default SecondMinigame;